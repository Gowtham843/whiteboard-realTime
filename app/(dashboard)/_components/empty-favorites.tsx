import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.gif"  // Replace with the correct path to your GIF
        height={160}
        width={160}
        alt="Empty"
      />
      <h2 className="text-2xl font-semibold mt-4">No Favorites found..!</h2>
      <p className="text-muted-foreground text-sm mt-2">Try Adding Organization to Favorites </p>
    </div>
  );
};
