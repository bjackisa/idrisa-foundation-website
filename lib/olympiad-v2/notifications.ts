/**
 * Notifications System
 * Functions for creating and managing notifications
 */

import { neon } from '@neondatabase/serverless';
import type { Notification, CreateNotificationInput, NotificationType } from './types';
import { NOTIFICATION_TEMPLATES } from './constants';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Create a notification
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  const result = await sql`
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data,
      sent_via_email,
      sent_via_sms
    )
    VALUES (
      ${input.user_id},
      ${input.type},
      ${input.title},
      ${input.message},
      ${input.data ? JSON.stringify(input.data) : null},
      ${input.send_email ?? false},
      ${input.send_sms ?? false}
    )
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to create notification');
  }

  // TODO: Trigger actual email/SMS sending here
  const notification = result[0] as Notification;

  if (input.send_email) {
    await sendEmailNotification(notification);
  }

  if (input.send_sms) {
    await sendSMSNotification(notification);
  }

  return notification;
}

/**
 * Send email notification (placeholder)
 */
async function sendEmailNotification(notification: Notification): Promise<void> {
  // TODO: Implement email sending using service like SendGrid, AWS SES, etc.
  console.log('Email notification:', notification);
}

/**
 * Send SMS notification (placeholder)
 */
async function sendSMSNotification(notification: Notification): Promise<void> {
  // TODO: Implement SMS sending using service like Twilio, Africa's Talking, etc.
  console.log('SMS notification:', notification);
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly: boolean = false,
  limit: number = 50
): Promise<Notification[]> {
  let query = sql`
    SELECT * FROM notifications
    WHERE user_id = ${userId}
  `;

  if (unreadOnly) {
    query = sql`${query} AND read_at IS NULL`;
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT ${limit}`;

  return (await query) as Notification[];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await sql`
    UPDATE notifications
    SET read_at = CURRENT_TIMESTAMP
    WHERE id = ${notificationId}
      AND read_at IS NULL
  `;
}

/**
 * Mark all notifications as read for user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await sql`
    UPDATE notifications
    SET read_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
      AND read_at IS NULL
  `;
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<void> {
  await sql`
    DELETE FROM notifications
    WHERE id = ${notificationId}
      AND user_id = ${userId}
  `;
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ${userId}
      AND read_at IS NULL
  `;

  return parseInt(result[0].count as string);
}

/**
 * Helper: Send enrollment confirmation notification
 */
export async function sendEnrollmentConfirmation(
  userId: string,
  editionName: string,
  subjects: string[]
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.ENROLLMENT_CONFIRMED;
  const message = template.message
    .replace('{edition_name}', editionName)
    .replace('{subjects}', subjects.join(', '));

  await createNotification({
    user_id: userId,
    type: 'ENROLLMENT_CONFIRMED',
    title: template.title,
    message,
    data: { edition_name: editionName, subjects },
    send_email: true,
  });
}

/**
 * Helper: Send stage qualification notification
 */
export async function sendStageQualificationNotification(
  userId: string,
  stage: string,
  subject: string,
  score: number
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.STAGE_QUALIFIED;
  const message = template.message
    .replace('{stage}', stage)
    .replace('{subject}', subject)
    .replace('{score}', score.toFixed(1));

  await createNotification({
    user_id: userId,
    type: 'STAGE_QUALIFIED',
    title: template.title,
    message,
    data: { stage, subject, score },
    send_email: true,
    send_sms: true,
  });
}

/**
 * Helper: Send exam reminder notification
 */
export async function sendExamReminder(
  userId: string,
  stage: string,
  subject: string,
  hours: number
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.EXAM_REMINDER;
  const message = template.message
    .replace('{stage}', stage)
    .replace('{subject}', subject)
    .replace('{hours}', hours.toString());

  await createNotification({
    user_id: userId,
    type: 'EXAM_REMINDER',
    title: template.title,
    message,
    data: { stage, subject, hours },
    send_email: true,
    send_sms: hours <= 2, // SMS only for urgent reminders
  });
}

/**
 * Helper: Send results published notification
 */
export async function sendResultsPublishedNotification(
  userId: string,
  stage: string,
  subject: string
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.RESULTS_PUBLISHED;
  const message = template.message
    .replace('{stage}', stage)
    .replace('{subject}', subject);

  await createNotification({
    user_id: userId,
    type: 'RESULTS_PUBLISHED',
    title: template.title,
    message,
    data: { stage, subject },
    send_email: true,
  });
}

/**
 * Helper: Send disqualification notification
 */
export async function sendDisqualificationNotification(
  userId: string,
  subject: string,
  reason: string
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.DISQUALIFIED;
  const message = template.message.replace('{subject}', subject);

  await createNotification({
    user_id: userId,
    type: 'DISQUALIFIED',
    title: template.title,
    message,
    data: { subject, reason },
    send_email: true,
  });
}

/**
 * Helper: Send final stage invitation
 */
export async function sendFinalInvitation(
  userId: string,
  venue: string,
  date: string
): Promise<void> {
  const template = NOTIFICATION_TEMPLATES.FINAL_INVITATION;
  const message = template.message
    .replace('{venue}', venue)
    .replace('{date}', date);

  await createNotification({
    user_id: userId,
    type: 'FINAL_INVITATION',
    title: template.title,
    message,
    data: { venue, date },
    send_email: true,
    send_sms: true,
  });
}

/**
 * Batch send notifications to multiple users
 */
export async function batchSendNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<number> {
  let sentCount = 0;

  for (const userId of userIds) {
    try {
      await createNotification({
        user_id: userId,
        type,
        title,
        message,
        data,
        send_email: true,
      });
      sentCount++;
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
    }
  }

  return sentCount;
}
