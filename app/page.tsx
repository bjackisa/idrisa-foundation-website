import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ParallaxSection } from "@/components/parallax-section"
import { AnimatedCounter } from "@/components/animated-counter"
import { VideoPlayer } from "@/components/video-player"
import { ImageGallery } from "@/components/image-gallery"
import Link from "next/link"
import {
  ArrowRight,
  Lightbulb,
  Target,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Calendar,
  TrendingUp,
  Globe,
  Heart,
  Trophy,
  BookOpen,
  Microscope,
  Cpu,
  Calculator,
  CheckCircle,
  Star,
  Sparkles,
  Rocket,
  Quote,
  Play,
} from "lucide-react"

export default function Home() {
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      alt: "Students collaborating on STEM project",
      caption: "Collaborative learning in action",
    },
    {
      src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
      alt: "Science laboratory",
      caption: "State-of-the-art laboratory facilities",
    },
    {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      alt: "Classroom learning",
      caption: "Interactive classroom sessions",
    },
    {
      src: "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800",
      alt: "African students studying",
      caption: "Dedicated scholars pursuing excellence",
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
      alt: "Robotics workshop",
      caption: "Hands-on robotics training",
    },
    {
      src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
      alt: "Technology education",
      caption: "Embracing modern technology",
    },
    {
      src: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
      alt: "University campus",
      caption: "Partnering with top institutions",
    },
    {
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      alt: "Graduation ceremony",
      caption: "Celebrating academic achievements",
    },
  ]

  return (
    <>
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section - Full Screen with Parallax Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-accent/20 rounded-full animate-rotate-slow" />

            {/* Floating Icons */}
            <div className="absolute top-32 right-20 text-white/20 animate-float">
              <Microscope className="w-12 h-12" />
            </div>
            <div className="absolute bottom-40 left-20 text-white/20 animate-float-delayed">
              <Calculator className="w-10 h-10" />
            </div>
            <div className="absolute top-1/2 right-32 text-white/20 animate-bounce-subtle">
              <Cpu className="w-8 h-8" />
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
                <Sparkles className="w-4 h-4 text-accent" />
                The Idrisa Foundation (U) Limited
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight text-balance">
                Every Young Person Deserves
                <span className="block mt-2 gradient-text-light">the Opportunity to Thrive</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                Transforming Uganda's future through STEM education, scholarships, and youth empowerment. We discover,
                nurture, and launch the next generation of scientists and innovators.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/participant/signup">
                  <Button
                    size="lg"
                    className="bg-accent text-white hover:bg-accent/90 font-semibold text-lg px-10 h-16 rounded-full shadow-2xl shadow-accent/30 ripple"
                  >
                    Join the Olympiad
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about/story">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold text-lg px-10 h-16 rounded-full backdrop-blur-sm"
                  >
                    Discover Our Story
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-subtle">
              <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center pt-2">
                <div className="w-2 h-4 bg-white/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="bg-primary py-8 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter end={2025} suffix="" />
                </div>
                <div className="text-white/70 text-sm">Founded</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter end={3} suffix="+" />
                </div>
                <div className="text-white/70 text-sm">Core Programs</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter end={6} suffix="+" />
                </div>
                <div className="text-white/70 text-sm">STEM Subjects</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter end={112} suffix="+" />
                </div>
                <div className="text-white/70 text-sm">Districts Targeted</div>
              </div>
            </div>
          </div>
        </section>

        {/* About / Mission Section */}
        <section className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-50" />

          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    <BookOpen className="w-4 h-4" />
                    Our Story
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Born from a Vision to
                    <span className="gradient-text block">Transform Lives</span>
                  </h2>

                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      In 2025, <strong className="text-foreground">Idrisa Kiryowa</strong>, a Masters degree student in
                      Russia with academic foundations from India and significant contributions to medical research,
                      founded The Idrisa Foundation with a singular mission: to give back to his homeland Uganda and his
                      beloved hometown of Entebbe.
                    </p>
                    <p>
                      Having experienced firsthand the transformative power of education and international exposure,
                      Idrisa recognized that countless brilliant minds across Uganda remain undiscovered simply due to
                      lack of opportunity. The Foundation exists to change that narrative.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/about/story">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                        Read Full Story
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/about/team">
                      <Button variant="outline" className="rounded-full px-8 bg-transparent">
                        Meet Our Team
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl img-zoom">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                      alt="Students engaged in collaborative learning"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                        <Globe className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">Entebbe</div>
                        <div className="text-sm text-muted-foreground">Our Hometown Base</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-accent rounded-full animate-pulse" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The Challenge We Address */}
        <ParallaxSection
          bgImage="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80"
          className="py-24 md:py-32"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <div className="text-white space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/20">
                    <Target className="w-4 h-4" />
                    The Challenge
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Uganda's STEM Gap Threatens Our Collective Future
                  </h2>

                  <p className="text-xl text-white/80 leading-relaxed">
                    Across Uganda, thousands of brilliant young minds lack access to quality STEM education, mentorship,
                    and the resources needed to develop their extraordinary potential. Without intervention, this
                    immense talent remains undiscovered and undeveloped.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Limited access to science laboratories and modern equipment",
                      "Absence of mentorship from practicing scientists and professionals",
                      "Financial barriers preventing talented students from advancing",
                      "Geographic isolation from educational opportunities",
                      "Lack of exposure to global STEM trends and careers",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-destructive/30 flex items-center justify-center shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                        </div>
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20 text-white space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-sm font-semibold">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    Our Solution
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold">A Complete Pipeline for STEM Excellence</h3>

                  <p className="text-white/80 leading-relaxed">
                    The Idrisa Foundation creates an end-to-end support system that identifies promising talent early,
                    provides world-class training and mentorship, and connects students with opportunities that forever
                    transform their futures.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        icon: Trophy,
                        title: "STEM Olympiad",
                        desc: "Multi-phase competitions to discover exceptional talent",
                      },
                      {
                        icon: GraduationCap,
                        title: "Scholarships & Grants",
                        desc: "Financial support to remove barriers to education",
                      },
                      {
                        icon: Briefcase,
                        title: "Career Pathways",
                        desc: "Internships, mentorship, and industry connections",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                          <item.icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{item.title}</h4>
                          <p className="text-sm text-white/70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ParallaxSection>

        {/* Our Programs Section */}
        <section className="py-24 md:py-32 px-4 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-30" />

          <div className="max-w-7xl mx-auto relative">
            <ScrollReveal>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                  <Rocket className="w-4 h-4" />
                  Our Programs
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Three Pillars of
                  <span className="gradient-text block">Transformation</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive programs designed to discover, develop, and deploy young STEM talent from every corner
                  of Uganda.
                </p>
              </div>
            </ScrollReveal>

            {/* Program 1: STEM Olympiad */}
            <ScrollReveal delay={100}>
              <div className="bg-background rounded-3xl overflow-hidden shadow-xl border border-border mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-10 md:p-14 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                      <Trophy className="w-4 h-4" />
                      Flagship Program
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">STEM Olympiad</h3>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Our multi-phase academic competition identifies and nurtures exceptional talent across
                      Mathematics, Sciences, and Technology. Open to Primary, O-Level, and A-Level students from all
                      districts of Uganda.
                    </p>

                    {/* Competition Phases */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">The Five Phases:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { phase: "1", name: "Preparation", desc: "Registration & orientation" },
                          { phase: "2", name: "Quiz Phase", desc: "30-60 min online quizzes" },
                          { phase: "3", name: "Bronze Phase", desc: "90-150 min theory exams" },
                          { phase: "4", name: "Silver Phase", desc: "150-195 min practicals" },
                          { phase: "5", name: "Golden Finale", desc: "Live grand finale event" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                              {item.phase}
                            </div>
                            <div>
                              <div className="font-medium text-foreground text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Subjects by Level:</h4>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Primary:
                          </span>
                          {["Mathematics", "Integrated Science", "Computer Knowledge"].map((s) => (
                            <span key={s} className="text-sm bg-muted px-3 py-1 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            O-Level:
                          </span>
                          {["Mathematics", "Biology", "Physics", "Chemistry", "ICT", "Agriculture"].map((s) => (
                            <span key={s} className="text-sm bg-muted px-3 py-1 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            A-Level:
                          </span>
                          {["Physics", "Chemistry", "Mathematics", "ICT", "Biology", "Agriculture"].map((s) => (
                            <span key={s} className="text-sm bg-muted px-3 py-1 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link href="/programs/olympiad">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                        Learn More About the Olympiad
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="relative h-[400px] lg:h-auto">
                    <img
                      src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
                      alt="Students in science competition"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent lg:bg-gradient-to-r" />

                    {/* Prize Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 lg:bottom-10 lg:left-10 lg:right-10">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-accent" />
                          Prizes & Rewards
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Full Scholarships</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Laptops</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Scholastic Materials</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Mentorship Access</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Programs 2 & 3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Career Guidance */}
              <ScrollReveal delay={200}>
                <div className="bg-background rounded-3xl overflow-hidden shadow-xl border border-border h-full card-hover">
                  <div className="h-64 relative img-zoom">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                      alt="Career mentorship session"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        <Users className="w-4 h-4" />
                        Mentorship
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <h3 className="text-2xl font-bold text-foreground">Career Guidance & Mentorship</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      One-on-one mentorship connecting students with professionals in their fields of interest. We help
                      students navigate career choices, prepare for higher education, and build networks that open doors
                      to opportunities.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Personalized career counseling sessions",
                        "Industry professional mentorship matching",
                        "University application support",
                        "Soft skills and leadership training",
                        "Career exploration workshops",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <ChevronRight className="w-4 h-4 text-accent shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/programs/mentorship"
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Explore Mentorship <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Internships & Holiday Jobs */}
              <ScrollReveal delay={300}>
                <div className="bg-background rounded-3xl overflow-hidden shadow-xl border border-border h-full card-hover">
                  <div className="h-64 relative img-zoom">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
                      alt="Students in internship program"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        <Briefcase className="w-4 h-4" />
                        Work Experience
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <h3 className="text-2xl font-bold text-foreground">Internships & Holiday Jobs</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We bridge the gap between classroom learning and real-world experience by connecting students and
                      fresh graduates with internship opportunities and holiday job placements across various
                      industries.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Paid internship placements",
                        "Holiday job opportunities",
                        "Industry exposure programs",
                        "Resume and interview preparation",
                        "Professional networking events",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <ChevronRight className="w-4 h-4 text-accent shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/programs/internships"
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Find Opportunities <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-24 md:py-32 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                  <Play className="w-4 h-4" />
                  Watch & Learn
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">See STEM Education in Action</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Witness the transformative power of STEM education across Africa through these inspiring stories.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ScrollReveal delay={100}>
                <VideoPlayer
                  thumbnailUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  videoId="8hnkDRuynUk"
                  title="STEM Education Transforming Lives in Africa"
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <VideoPlayer
                  thumbnailUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                  videoId="d88VlkjXENk"
                  title="Young Math Champions: Journey to Excellence"
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Why STEM Matters */}
        <ParallaxSection
          bgImage="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80"
          className="py-24 md:py-32"
        >
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center text-white mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/20">
                  <TrendingUp className="w-4 h-4" />
                  Why STEM Matters
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  The Future Belongs to
                  <span className="block text-accent">Problem Solvers</span>
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  In an increasingly complex world, STEM skills are no longer optional – they are essential for
                  individual success and national development.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Microscope, stat: "70%", label: "of future jobs will require STEM skills" },
                { icon: Globe, stat: "2x", label: "higher earning potential for STEM graduates" },
                { icon: Lightbulb, stat: "85%", label: "of jobs in 2030 don't exist today" },
                { icon: Rocket, stat: "100%", label: "of global challenges need STEM solutions" },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{item.stat}</div>
                    <p className="text-white/70 text-sm">{item.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ParallaxSection>

        {/* Testimonials / Vision */}
        <section className="py-24 md:py-32 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="bg-primary rounded-3xl p-10 md:p-16 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white space-y-8">
                    <Quote className="w-16 h-16 text-accent/50" />
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed italic">
                      "I believe that every young Ugandan, regardless of their background, carries within them the
                      potential to become a scientist, an innovator, a problem-solver. Our job is simply to help them
                      discover and unleash that potential."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">IK</span>
                      </div>
                      <div>
                        <div className="font-bold text-xl">Idrisa Kiryowa</div>
                        <div className="text-white/70">Founder, The Idrisa Foundation</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Heart, label: "Passion for Education" },
                      { icon: Target, label: "Clear Vision" },
                      { icon: Users, label: "Community Focus" },
                      { icon: Sparkles, label: "Excellence Driven" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                      >
                        <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                        <div className="text-white font-medium text-sm">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="py-24 md:py-32 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                  <Star className="w-4 h-4" />
                  Gallery
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Moments of Discovery</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  A glimpse into the transformative experiences that define our programs.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <ImageGallery images={galleryImages} />
            </ScrollReveal>
          </div>
        </section>

        {/* How to Get Involved */}
        <section className="py-24 md:py-32 px-4 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />

          <div className="max-w-7xl mx-auto relative">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                  <Heart className="w-4 h-4" />
                  Get Involved
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Join the Movement</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Whether you're a student ready to compete, a professional wanting to mentor, or a supporter looking to
                  make a difference – there's a place for you in our community.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Students",
                  desc: "Register for the Olympiad and unlock your potential",
                  action: "Apply Now",
                  href: "/participant/signup",
                  color: "bg-accent",
                },
                {
                  icon: Users,
                  title: "Mentors",
                  desc: "Share your expertise and guide the next generation",
                  action: "Become a Mentor",
                  href: "/get-involved/volunteer",
                  color: "bg-primary",
                },
                {
                  icon: Heart,
                  title: "Donors",
                  desc: "Fund scholarships and transform young lives",
                  action: "Donate Now",
                  href: "/get-involved/donate",
                  color: "bg-green-600",
                },
                {
                  icon: Briefcase,
                  title: "Partners",
                  desc: "Collaborate with us to expand our impact",
                  action: "Partner With Us",
                  href: "/get-involved/partner",
                  color: "bg-orange-500",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-8 border border-border card-hover text-center h-full flex flex-col">
                    <div
                      className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground mb-6 flex-grow">{item.desc}</p>
                    <Link href={item.href}>
                      <Button className={`w-full ${item.color} hover:opacity-90 text-white rounded-full`}>
                        {item.action}
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Preview */}
        <section className="py-24 md:py-32 px-4 bg-primary text-white">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold mb-4">
                    <Calendar className="w-4 h-4" />
                    Upcoming
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">Events & Announcements</h2>
                </div>
                <Link href="/news/events">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-full"
                  >
                    View All Events
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  date: "Coming Soon",
                  title: "2025 STEM Olympiad Launch",
                  desc: "Registration opens for our inaugural STEM Olympiad competition",
                  tag: "Olympiad",
                },
                {
                  date: "TBA",
                  title: "Career Guidance Workshop",
                  desc: "Free workshop on STEM career pathways for secondary students",
                  tag: "Workshop",
                },
                {
                  date: "TBA",
                  title: "Partner Schools Orientation",
                  desc: "Introduction session for schools interested in joining our network",
                  tag: "Partnership",
                },
              ].map((event, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-1 rounded-full">
                        {event.tag}
                      </span>
                    </div>
                    <div className="text-accent font-semibold mb-2">{event.date}</div>
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <p className="text-white/70 text-sm">{event.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 px-4 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                Start Your Journey
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                Ready to Discover
                <span className="gradient-text block">Your Potential?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of ambitious students across Uganda who are taking the first step towards an
                extraordinary future in STEM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/participant/signup">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-16 text-lg shadow-xl shadow-primary/20"
                  >
                    Register for the Olympiad
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg bg-transparent">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
