import { useState } from "react";
import { Check, Ban, Crown } from "lucide-react";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import paymentApplepay from "@/assets/payment-applepay.png";
import paymentVisa from "@/assets/payment-visa.png";
import paymentMastercard from "@/assets/payment-mastercard.png";
import paymentIdeal from "@/assets/payment-ideal.png";
import paymentPaypal from "@/assets/payment-paypal.png";

type PlanTier = "standard" | "premium";

interface PlanData {
  duration: string;
  price: string;
  originalPrice: string;
  discount: string;
  popular?: boolean;
}

const standardPlans: PlanData[] = [
  { duration: "1 MAAND", price: "€ 11.99", originalPrice: "€24", discount: "50% KORTING" },
  { duration: "3 MAANDEN", price: "€ 25.99", originalPrice: "€50", discount: "50% KORTING" },
  { duration: "6 MAANDEN", price: "€ 35.99", originalPrice: "€70", discount: "50% KORTING" },
  { duration: "12 MAANDEN", price: "€ 45.99", originalPrice: "€90", discount: "50% KORTING", popular: true },
];

const premiumPlans: PlanData[] = [
  { duration: "1 MAAND", price: "€ 19.99", originalPrice: "€25", discount: "50% KORTING" },
  { duration: "3 MAANDEN", price: "€ 29.99", originalPrice: "€60", discount: "50% KORTING" },
  { duration: "6 MAANDEN", price: "€ 49.99", originalPrice: "€100", discount: "50% KORTING" },
  { duration: "12 MAANDEN", price: "€ 69.99", originalPrice: "€140", discount: "50% KORTING", popular: true },
];

const standardFeatures = [
  { icon: "ban", text: "Plus Extra 2 Maanden" },
  { icon: "check", text: "Directe Activering!" },
  { icon: "check", text: "+15.000 Kanalen" },
  { icon: "check", text: "+80.000 Films en Series (VOD)" },
  { icon: "check", text: "RTL - Viaplay - Videoland" },
  { icon: "check", text: "Terugkijken en EPG" },
  { icon: "check", text: "FHD, HD, Kanalen" },
  { icon: "check", text: "24/7 Live Chat Ondersteuning" },
  { icon: "check-green", text: "7-dagen geld-terug-garantie" },
];

const premiumFeatures = [
  { icon: "ban", text: "Plus Extra 3 Maanden" },
  { icon: "check", text: "Directe Activering!" },
  { icon: "check", text: "+30.000 Kanalen" },
  { icon: "check", text: "+180k Films en Series (VOD)" },
  { icon: "check", text: "RTL - Viaplay - Videoland" },
  { icon: "check", text: "Terugkijken en EPG" },
  { icon: "check", text: "4K, UHD, FHD, HD, Kanalen" },
  { icon: "check", text: "24/7 Live Chat Ondersteuning" },
  { icon: "check-green", text: "7-dagen geld-terug-garantie" },
];

const standardBadges = ["HD", "FHD"];
const premiumBadges = ["HD", "FHD", "4K"];

const paymentIcons = [
  { name: "Apple Pay", src: paymentApplepay },
  { name: "VISA", src: paymentVisa },
  { name: "MasterCard", src: paymentMastercard },
  { name: "iDEAL", src: paymentIdeal },
  { name: "PayPal", src: paymentPaypal },
];

export default function PricingTable() {
  const [tier, setTier] = useState<PlanTier>("standard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ duration: string; price: string } | null>(null);

  const plans = tier === "standard" ? standardPlans : premiumPlans;
  const baseFeatures = tier === "standard" ? standardFeatures : premiumFeatures;
  const badges = tier === "standard" ? standardBadges : premiumBadges;

  const getFeaturesForPlan = (duration: string) => {
    const is12Months = duration === "12 MAANDEN";
    return baseFeatures.map((f) => {
      const isExtraMonths = f.text.startsWith("Plus Extra");
      if (isExtraMonths && is12Months) {
        return { ...f, icon: "check" };
      }
      return f;
    });
  };
  const buttonClass = tier === "standard" ? "bg-standard-active text-primary-foreground" : "bg-accent text-accent-foreground";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full border border-border bg-card overflow-hidden">
          <button
            onClick={() => setTier("standard")}
            className={`px-8 py-3 text-base font-semibold transition-colors ${
              tier === "standard" ? "bg-standard-active text-primary-foreground" : "text-foreground"
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setTier("premium")}
            className={`px-8 py-3 text-base font-semibold transition-colors flex items-center gap-1.5 ${
              tier === "premium" ? "bg-premium-active text-primary-foreground" : "text-foreground"
            }`}
          >
            Premium <Crown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.duration}
            className={`relative rounded-lg border bg-card overflow-hidden flex flex-col ${
              plan.popular
                ? tier === "standard"
                  ? "border-premium-active border-2"
                  : "border-popular border-2"
                : "border-border"
            }`}
          >
            {plan.popular && (
              <div
                className={`text-center text-xs font-bold py-1.5 tracking-wider uppercase ${
                  tier === "standard"
                    ? "bg-premium-active text-primary-foreground"
                    : "bg-popular text-accent-foreground"
                }`}
              >
                Most Popular
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              {/* Header */}
              <h3 className={`text-xl font-bold text-center ${tier === "premium" ? "text-premium-active" : "text-foreground"}`}>
                {plan.duration}
              </h3>
              <p className="text-4xl font-extrabold text-center mt-2 text-foreground">{plan.price}</p>
              <p className="text-center mt-2 text-sm">
                <span className="text-discount font-semibold line-through">ORIGINELE PRIJS {plan.originalPrice}</span>
                <span className="text-muted-foreground mx-2">|</span>
                <span className="text-success font-semibold">{plan.discount}</span>
              </p>

              {/* Badges */}
              <div className="flex justify-center gap-2 mt-4">
                {badges.map((b) => (
                  <span key={b} className="border border-foreground rounded px-2 py-0.5 text-xs font-bold text-foreground">
                    {b}
                  </span>
                ))}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3 flex-1">
                {getFeaturesForPlan(plan.duration).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    {f.icon === "ban" ? (
                      <Ban className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${f.icon === "check-green" ? "text-success" : "text-muted-foreground"}`} />
                    )}
                    <span className={f.icon === "check-green" ? "font-semibold text-success" : ""}>{f.text}</span>
                  </li>
                ))}
              </ul>
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    {f.icon === "ban" ? (
                      <Ban className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${f.icon === "check-green" ? "text-success" : "text-muted-foreground"}`} />
                    )}
                    <span className={f.icon === "check-green" ? "font-semibold text-success" : ""}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => { setSelectedPlan({ duration: plan.duration, price: plan.price }); setDialogOpen(true); }}
                className={`w-full mt-6 py-3 rounded-md font-bold text-base transition-opacity hover:opacity-90 ${buttonClass}`}
              >
                Abonneer je nu
              </button>

              {/* Payment icons */}
              <div className="flex justify-center items-center gap-3 mt-4">
                {paymentIcons.map((m) => (
                  <img key={m.name} src={m.src} alt={m.name} loading="lazy" className="h-7 w-auto object-contain" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <SubscriptionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          plan={`${tier} - ${selectedPlan.duration}`}
          price={selectedPlan.price}
        />
      )}
    </div>
  );
}
