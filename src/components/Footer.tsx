import { FascoH1 } from "../UI/FascoH1";

export const Footer: React.FC = () => {
  return (
    <footer className="flex justify-between items-center gap-5 ">
      <FascoH1 />
      <ul className="text-[16px]  to-gray-300 flex gap-3.5">
        <li>Support Center</li>
        <li>Invoicing</li>
        <li>Contract</li>
        <li>Careers</li>
        <li>Blog</li>
        <li>FAQ,s</li>
      </ul>
    </footer>
  );
};
