import cn from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [canShowImage, setCanShowImage] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    toast("Nous générons votre image...", { position: "top-center" });
    const response = await fetch(`/api/generate?prompt=${prompt}`);
    const json = await response.json();
    if (response.status === 202) {
      setLoading(false);
      setImage(json.url);
    }
    if (response.status === 429) {
      setLoading(false);
      alert(json.message);
    }
    if (response.status === 500) {
      setLoading(false);
      alert(json.message);
    }
  }

  const showLoadingState = loading || (image && !canShowImage);

  return (
    <>
      <Head>
        <title>Générateur d&apos;images</title>
      </Head>
      <div className="mx-auto h-screen bg-gray-100 px-4 antialiased">
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <Image src={"/logo.svg"} alt="" width={443} height={100} />
          <h1 className="pb-10 text-5xl font-bold tracking-tighter text-gray-800">
            Générateur d&apos;images
          </h1>
          <form
            className="mb-10 flex w-full flex-col sm:w-auto sm:flex-row"
            onSubmit={submitForm}
          >
            <input
              className="mb-4 rounded-sm px-3 py-2 text-gray-700 shadow-sm sm:mb-0 sm:min-w-[600px]"
              type="text"
              placeholder="Entrez vos instructions"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-green-600 py-2 px-4 font-medium text-gray-100 shadow-sm hover:bg-green-700 sm:ml-2 sm:w-[100px]"
              type="submit"
            >
              {showLoadingState && (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {!showLoadingState ? "Générer" : ""}
            </button>
          </form>
          <div className="relative flex w-full items-center justify-center">
            {image ? (
              <div className="relative h-[400px] w-full rounded-md shadow-md sm:w-[400px]">
                <Image
                  alt={`Dall-E representation of: ${prompt}`}
                  className={cn(
                    "h-full rounded-md object-cover opacity-0 shadow-md duration-1000 ease-in-out",
                    { "opacity-100": canShowImage }
                  )}
                  src={image}
                  fill={true}
                  onLoadingComplete={() => {
                    setCanShowImage(true);
                  }}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "absolute top-0.5 w-full overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5 sm:w-[400px]",
                  {
                    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transparent":
                      showLoadingState,
                    "opacity-0 shadow-none": canShowImage,
                  }
                )}
              >
                <div
                  className={cn(
                    "flex h-[400px] w-full items-center justify-center rounded-md bg-gray-200 shadow-md sm:w-[400px]"
                  )}
                >
                  <p className="text-sm uppercase text-gray-400">
                    {showLoadingState
                      ? "Generation d'image..."
                      : "Aucune image générée"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
