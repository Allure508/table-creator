import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
  price: string;
}

export default function SubscriptionDialog({ open, onOpenChange, plan, price }: SubscriptionDialogProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      toast.error("Vul alle velden in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://forms.voodportal.com/api/webhook/Koop_IPTV", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          plan,
          price,
          form_type: "subscription_request",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Aanvraag succesvol verzonden!");
      setEmail("");
      setPhone("");
      onOpenChange(false);
    } catch {
      toast.error("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Abonneer je nu</DialogTitle>
          <DialogDescription>
            Plan: <strong>{plan}</strong> — Prijs: <strong>{price}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="jouw@email.nl" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input id="phone" type="tel" placeholder="+31 6 12345678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verzenden..." : "Verstuur aanvraag"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
