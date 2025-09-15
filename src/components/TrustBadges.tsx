import { Shield, Award, Globe, Clock } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health information is secure and protected"
    },
    {
      icon: Award,
      title: "Certified Consultants",
      description: "Licensed healthcare professionals with global expertise"
    },
    {
      icon: Globe,
      title: "International Network",
      description: "Partnerships with top hospitals and insurers worldwide"
    },
    {
      icon: Clock,
      title: "24/7 Emergency Support", 
      description: "Round-the-clock assistance when you need it most"
    }
  ];

  return (
    <section className="py-12 bg-background border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div key={badge.title} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;