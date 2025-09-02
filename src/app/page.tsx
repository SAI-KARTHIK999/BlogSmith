import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Abstract background"
          data-ai-hint="abstract gradient"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight md:text-6xl text-shadow-lg">
          Unleash Your Creativity with AI
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 text-shadow">
          Say goodbye to writer's block. ContentCraft AI helps you generate high-quality blogs, emails, and ad copy in seconds.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
