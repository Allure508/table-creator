import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { CheckCircle, Mail } from "lucide-react";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
  price: string;
}

export default function SubscriptionDialog({ open, onOpenChange, plan, price }: SubscriptionDialogProps) {
  const isStandard = plan.toLowerCase().startsWith("standard");
  const accentBg = isStandard ? "bg-premium-active hover:bg-premium-active/90" : "bg-popular hover:bg-popular/90";
  const accentText = isStandard ? "text-premium-active" : "text-popular";
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      toast.error("Vul alle velden in.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("webhook-proxy", {
        body: {
          email,
          phone,
          plan,
          price,
          form_type: "subscription_request",
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast.error("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSubmitted(false);
      setEmail("");
      setPhone("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-6 space-y-5">
            <div className={`w-16 h-16 rounded-full ${isStandard ? "bg-premium-active" : "bg-popular"} flex items-center justify-center`}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${accentText}`}>Bedankt Voor Je Aanvraag!</h2>
            <p className="text-muted-foreground">
              Je aanvraag is ontvangen. 📧 Binnen <strong>10 tot 60 minuten</strong> ontvang je je abonnement en betaalinformatie via e-mail of WhatsApp.
            </p>
            <p className="text-muted-foreground text-sm">Vergeet niet je spamfolder te controleren.</p>
            <a
              href="https://www.koop-iptv.nl/"
              className={`w-full flex items-center justify-center ${accentBg} text-white text-lg py-3 rounded-md font-medium transition-colors`}
            >
              Naar beginpagina
            </a>
            <p className="font-semibold text-foreground">Contacteer Ons Via E-mail</p>
            <a
              href="mailto:contact@hollandiptv.com"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-md py-3 text-lg font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              contact@hollandiptv.com
            </a>
          </div>
        ) : (
          <>
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
              <Button type="submit" className={`w-full ${isStandard ? "bg-premium-active hover:bg-premium-active/90 text-primary-foreground" : ""}`} disabled={loading}>
                {loading ? "Verzenden..." : "Verstuur aanvraag"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}