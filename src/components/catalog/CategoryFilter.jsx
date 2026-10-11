import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sparkles, Package, Home as HomeIcon, ShoppingBag, Shirt, Gift, Flower, KeyRound } from "lucide-react";
import { fetchCategories } from "@/lib/store";

const ICONS = {
  toys: Package,
  home_decor: HomeIcon,
  accessories: ShoppingBag,
  clothing: Shirt,
  bags: ShoppingBag,
  keychains: KeyRound,
  flowers: Flower,
  gifts: Gift,
};

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categories = [
    { id: "all", label: "All Items", icon: Sparkles },
    ...dbCategories.map((c) => ({
      id: c.name,
      label: c.label || c.name.replace(/_/g, ' '),
      icon: ICONS[c.name] || Sparkles,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;

        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`${
              isActive
                ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white border-[#D97757]'
                : 'border-2 border-gray-200 text-gray-700 hover:border-[#D97757] hover:text-[#D97757] hover:bg-[#FFF8F0]'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
