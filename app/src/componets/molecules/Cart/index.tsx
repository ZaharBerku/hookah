
const Cart = () => {
  return (
    <div className="rounded-3xl absolute hidden md:block top-[calc(100%+10px)] right-0 rounded-tr-none px-6 pt-4.5 pb-6 shadow-3xl shadow-card-shadow-color bg-white w-64 h-96">
      <span className="absolute bottom-full right-0 w-6 h-6 md:w-12 md:h-14 rounded-full rounded-b-none px-1 pr-3 py-1 bg-white">
        <span className="bg-black w-7 h-9 absolute bottom-0 -left-7 z-10 rounded-full"></span>
        <span className="bg-white w-8 h-7 absolute -bottom-2 -left-4 -rotate-45"></span>
      </span>
    </div>
  );
};

export { Cart };
