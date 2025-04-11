import { useState } from "react";
import Button from "../UI/AnchorButton";
import NewsletterSignUpWoman from "../assets/NewsletterSignUpWoman.png";
import NewsletterSignUpMan from "../assets/NewsletterSignUpMan.png";
import { useQueryClient } from "@tanstack/react-query";

export const NewsletterSignUp: React.FC = () => {
  // const newTan = useQueryClient()

  // const data = newTan.getQueryData(["Filter"])
  // console.log("зовніщнє", data);

  const [inputValue, setInputValue] = useState("");

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Correct event type
    setInputValue(e.target.value);
    console.log(inputValue);
  };

  return (
    <section className="py-12">
      {" "}
      {/* Added padding to the top and bottom */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center min-h-[400px] lg:min-h-[500px] gap-8">
        {/* Increased minimum height for better spacing */}
        <div className="w-full md:w-1/4">
          {" "}
          {/* Responsive widths for images */}
          <img
            src={NewsletterSignUpMan}
            alt="man"
            className="w-full h-auto object-cover"
          />{" "}
          {/*Responsive img*/}
        </div>

        <div className="flex flex-col items-center justify-center text-center md:w-1/2">
          {" "}
          {/*Adjusted width*/}
          <h2 className="text-2xl font-semibold mb-4">
            Subscribe To Our Newsletter
          </h2>{" "}
          {/*Increased font size and added margin*/}
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin.
          </p>
          <input
            value={inputValue}
            onChange={onChangeHandler}
            placeholder="Введіть електрону пошту"
            type="email"
            className="border border-gray-300 rounded-md py-2 px-4 w-full max-w-md mb-4" // Added styles to input
          />
          <Button className="border-none text-white bg-black px-5 py-4">
            Підписатися зараз
          </Button>
        </div>

        <div className="w-full md:w-1/4">
          <img
            src={NewsletterSignUpWoman}
            alt="woman"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};
