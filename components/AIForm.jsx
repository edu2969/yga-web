"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { IoHardwareChipSharp } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function AIForm() {
  const router = useRouter();
  const onError = (errors, e) => console.log(errors, e)
  const [position, setPosition] = useState(0);

  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState("");

  const onSubmitIA = async (data) => {
    setError(false);
    setPosition(1);
  }

  const handleBackMenu = () => {
    setPosition(0);
  }

  const handleNextMenu = () => {
    setPosition(position > 2 ? 1 : (position + 1));
    console.log("POSITION", position);
  }

  const onSubmit = async (data) => {
    setError(false);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      console.log("RES", res);
      router.replace("modulos");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  return (
    <main className="absolute w-full h-screen">
      <div id="welcome-background" className={`${position != 0 && ('active-' + position)} items-center`}>
        <div className="absolute bottom-0 w-full h-screen">
          <div className="neon absolute block border-white border-4 border-solid h-3/4 w-1/3 left-0">3</div>
          <div className="neon absolute block border-white border-4 border-solid h-3/4 w-1/3 left-1/3">3</div>
          <div className="neon absolute block border-white border-4 border-solid h-3/4 w-1/3 left-2/3">3</div>
        </div>
        <div id="marco-conectores"></div>
        <div id="marco-prompt" className={`${position != 0 && 'active'}`}>
          <div className="neon text-6xl text-center p-12">¿Qué buscas?</div>
          <form className="mt-2 sm:mx-auto w-full sm:max-w-sm md:max-w-md lg:max-w-lg" onSubmit={handleSubmit(onSubmitIA, onError)}>
            <div className="space-y-6">
              <div>
                <label htmlFor="prompt" className="neon flex text-xl font-medium leading-6 text-gray-400">Describe, ingresa palabras y presiona el chip <IoHardwareChipSharp className="ml-2" size="1.5em" /></label>
                <div className="mt-2">
                  {errors.email && <p className="text-red-500">e-mail requerido</p>}
                  <textarea {...register("prompt", { required: true })}
                    id="prompt" name="prompt" type="text" required
                    rows={5}
                    className="p-3 block w-full rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg" />
                </div>
              </div>
              {error && <span className="relative h-0 text-red-500">{error}</span>}
              <div className="flex">
                <button type="submit" id="btnSend" className="btn" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={`absolute bottom-0 cursor-pointer ${position == 0 ? '-left-40' : 'left-0'} transition-all`}>
        <div className="neon text-8xl ml-2" onClick={handleBackMenu}>&lt;</div>
        <span className="relative neon text-sm ml-6 -top-3">Menú</span>
      </div>
      <div className={`absolute bottom-0 cursor-pointer ${position == 0 ? '-right-40' : 'right-0'} transition-all`}>
        <div className={`neon text-8xl mr-2`} onClick={handleNextMenu}>&gt;</div>
        <span className="relative neon text-sm mr-6 -top-3">Ver más</span>
      </div>
    </main>
  );
}