
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  name: string;
  priceId: string;
  price: number;
  drops: number;
}

const plans: Plan[] = [
  {
    name: "Starter",
    priceId: "price_1R1snxRKZZ9Z1atyiTfypjpO",
    price: 249,
    drops: 3000,
  },
  {
    name: "Grow",
    priceId: "price_1R1soKRKZZ9Z1atyzuT8mW92",
    price: 499,
    drops: 6000,
  },
  {
    name: "Scale",
    priceId: "price_1R1soXRKZZ9Z1atyGrCeSN3v",
    price: 995,
    drops: 12000,
  },
];

export const PricingPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.priceId} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground">
              Up to {plan.drops.toLocaleString()} drops per month
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#004838] hover:bg-[#003026]"
              onClick={() => handleSubscribe(plan.priceId)}
            >
              Subscribe
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
