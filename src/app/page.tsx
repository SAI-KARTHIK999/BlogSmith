import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Mail, Megaphone, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

const features = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: 'Blog Posts',
    description: 'Generate engaging and well-structured blog articles on any topic in minutes.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-accent" />,
    title: 'Social Media',
    description: 'Create catchy tweets, and social media posts that capture attention.',
  },
  {
    icon: <Mail className="h-8 w-8 text-accent" />,
    title: 'Emails',
    description: 'Craft professional and persuasive emails for marketing campaigns or personal use.',
  },
  {
    icon: <Megaphone className="h-8 w-8 text-accent" />,
    title: 'Ad Copy',
    description: 'Produce high-converting ad copy that drives clicks and boosts sales.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/20 px-4 py-1 text-sm font-medium text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Generative AI</span>
            </div>
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tight md:text-6xl">
            Unleash Your Creativity with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            ContentCraft AI helps you generate high-quality blogs, emails, ad copy, and more in seconds. Say goodbye to writer's block and hello to effortless content creation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        <section className="container py-20">
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl">
                <Image
                    src="https://picsum.photos/1200/800"
                    alt="AI Content Generation Dashboard"
                    data-ai-hint="digital creative"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-headline font-bold">Everything You Need to Create</h2>
              <p className="mt-4 text-muted-foreground">
                From drafting articles to brainstorming ideas, ContentCraft AI is your all-in-one solution for content creation.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center bg-card">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-headline font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20 text-center">
          <h2 className="text-3xl font-headline font-bold">Ready to Start Creating?</h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of creators and marketers who trust ContentCraft AI.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Sign up now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ContentCraft AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
