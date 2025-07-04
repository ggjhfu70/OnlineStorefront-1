import { Laptop, ShirtIcon, Home, Dumbbell } from "lucide-react";

interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
}

export default function CategorySection({ onCategorySelect }: CategorySectionProps) {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      icon: Laptop,
      color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: ShirtIcon,
      color: "bg-pink-100 hover:bg-pink-200 text-pink-600",
    },
    {
      id: "home",
      name: "Home & Garden",
      icon: Home,
      color: "bg-green-100 hover:bg-green-200 text-green-600",
    },
    {
      id: "sports",
      name: "Sports",
      icon: Dumbbell,
      color: "bg-orange-100 hover:bg-orange-200 text-orange-600",
    },
  ];

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">Shop by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className="text-center group cursor-pointer"
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={`p-6 rounded-xl mb-3 transition-colors ${category.color}`}>
                <IconComponent className="w-8 h-8 mx-auto" />
              </div>
              <h4 className="font-semibold">{category.name}</h4>
            </div>
          );
        })}
      </div>
    </section>
  );
}
