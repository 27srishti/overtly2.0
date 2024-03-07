import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 ">
    <div className="border-b bg-opacity-20  backdrop-filter backdrop-blur-lg">
      <div className="container flex justify-between px-2 items-center">
        <div className="flex items-center justify-center text-lg">
          <img src="/images.png" className="w-12" alt="Logo" />
          <div className="ml-2">Public relation</div>
        </div>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Navbar;
