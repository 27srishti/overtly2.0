import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 ">
      <div className="border-b bg-opacity-20  backdrop-filter backdrop-blur-lg">
        <div className="container flex justify-between px-2 items-center">
          <div className="flex items-center justify-center text-lg">
            <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12"
            >
              <path
                d="M10 15L24 33"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 18L33 35"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* <img src="/images.png" className="w-12" alt="Logo" /> */}
            <div className="ml-2">Public relation</div>
          </div>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
