import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BookOpen, Brain, TrendingUp, Users, Play, Star, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  const [animatedStats, setAnimatedStats] = useState({ users: 0, cards: 0, languages: 0 })

  // Animate statistics on component mount
  useEffect(() => {
    const targets = { users: 10000, cards: 500000, languages: 25 }
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps

    const animate = (key, target) => {
      let current = 0
      const increment = target / steps
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, stepTime)
    }

    animate('users', targets.users)
    animate('cards', targets.cards)
    animate('languages', targets.languages)
  }, [])

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Flashcards",
      description: "Create and study with beautifully designed flashcards that support text, images, and audio.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Spaced Repetition",
      description: "Learn more effectively with our scientifically-proven spaced repetition algorithm.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and performance metrics.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiple Languages",
      description: "Support for dozens of languages with customizable learning paths.",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Language Student",
      content: "This app helped me master Spanish vocabulary in just 3 months!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Professional Translator",
      content: "The spaced repetition algorithm is incredibly effective for retention.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Teacher",
      content: "I use this with my students. The progress tracking is fantastic!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Master Any Language with 
            <span className="block gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Smart Flashcards
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
            Learn faster and retain more with our intelligent spaced repetition system. 
            Create custom decks, track your progress, and achieve fluency with AI-powered suggestions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl">
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Link>
                <Link to="/login" className="btn btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">{animatedStats.users.toLocaleString()}+</div>
              <div className="text-sm opacity-80">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{animatedStats.cards.toLocaleString()}+</div>
              <div className="text-sm opacity-80">Cards Studied</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{animatedStats.languages}+</div>
              <div className="text-sm opacity-80">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content">
        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful features designed to accelerate your language learning journey with modern technology
              </p>
            </header>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <article key={index} className="card-interactive p-8 text-center group">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <header className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Join thousands of successful language learners
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <article key={index} className="card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <footer>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of learners who are already mastering new languages with our AI-powered platform.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105">
                <CheckCircle className="w-5 h-5 mr-2" />
                Create Your Free Account
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home