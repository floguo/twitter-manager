'use client';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return (
    <Button 
      onClick={() => signIn()}
      variant="default"
      size="lg"
    >
      Sign In with Twitter
    </Button>
  );
} 