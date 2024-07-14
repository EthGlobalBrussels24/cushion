"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/lib/authContext";
import { useToast } from "~/components/ui/use-toast";
import { useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { cushionFactoryAbi } from "~/lib/abi";
import { parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { navigate } from "next/navigation";

// Define your form schemas for each step
const step1Schema = z.object({
  image: z.instanceof(FileList),
  description: z.string().min(1, "Description is required"),
  twitter: z.string().url("Invalid URL"),
  telegram: z.string().url("Invalid URL"),
});

const step2Schema = z.object({
  name: z.string().min(1, "Name is required"),
  ticker: z.string().min(1, "Ticker is required"),
  totalSupply: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, "Total supply is required")
      .positive("Total supply must be a positive number"),
  ),
  deployOn: z.string().min(1, "Please select a chain"),
});

const formSchema = step1Schema.merge(step2Schema);

type FormData = z.infer<typeof formSchema>;

export default function TokenForm() {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { session, loading } = useAuth();
  const { toast } = useToast();
  const { writeContract, status } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const activeChainId = useChainId();

  const notAuthenticatedToastProps = {
    title: "Authentication required",
    description: "Login with World Id to perform this action",
  };
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticker: "",
      totalSupply: 0,
      image: null,
      description: "",
      twitter: "",
      telegram: "",
      deployOn: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    if (activeChainId !== baseSepolia.id) {
      switchChain({
        chainId: baseSepolia.id,
      });
    }

    // other chains here
    writeContract({
      abi: cushionFactoryAbi,
      address: "0x74c4aEDEdE3E3bB201478Ad760F45aD2eA9Cca2E",
      functionName: "launchCushionToken",
      args: [
        data.name,
        data.ticker,
        parseUnits(data.totalSupply.toString(), 18),
      ],
    });
  };

  useEffect(() => {
    switch (status) {
      case "success":
        toast({
          title: "Token deployed",
          description: "Your token has been deployed successfully",
        });
        navigate("/");
        break;
      case "error":
        toast({
          title: "Error",
          description: "An error occurred while deploying your token",
          variant: "destructive",
        });
        break;
    }
  }, [status]);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        "image",
        "description",
        "twitter",
        "telegram",
      ]);
    } else if (step === 2) {
      isValid = await form.trigger([
        "name",
        "ticker",
        "totalSupply",
        "deployOn",
      ]);
    }
    if (isValid) {
      if (step === 1) {
        const file = form.getValues("image")[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      setStep(step + 1);
    }
  };

  // if (!session) {
  //     toast(notAuthenticatedToastProps)
  // }
  useEffect(() => {
    if (!session) {
      toast(notAuthenticatedToastProps);
    }
  }, [session]);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 flex">
        <img
          src="/cushion2.png"
          alt="pillow"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="container relative z-10 mx-auto mb-8 w-1/2 overflow-hidden rounded-2xl border border-2 bg-white p-4 shadow-xl">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Launch Unruggable Token
        </h1>
        <div className="mb-8 flex items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              <div
                className={`flex flex-col items-center ${step >= 1 ? "text-green-500" : "text-gray-500"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-green-500" : "bg-gray-300"}`}
                >
                  {step > 1 ? <span className="text-black">✓</span> : "1"}
                </div>
                <div>Details</div>
              </div>
              <div
                className={`flex flex-col items-center ${step >= 2 ? "text-pink-500" : "text-gray-500"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-pink-500" : "bg-gray-300"}`}
                >
                  {step > 2 ? <span className="text-black">✓</span> : "2"}
                </div>
                <div>Deploy</div>
              </div>
              <div
                className={`flex flex-col items-center ${step >= 3 ? "text-green-500" : "text-gray-500"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-green-500" : "bg-gray-300"}`}
                >
                  3
                </div>
                <div>Review</div>
              </div>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Choose an image
                      </FormLabel>
                      <FormControl className="flex items-start justify-start">
                        <input
                          type="file"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleNextStep();
                          }}
                          className="w-full rounded-lg border border-2 p-2"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="mt-1 block w-full"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Twitter (X)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1 block w-full" />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Telegram
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1 block w-full" />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1 block w-full" />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Ticker
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1 block w-full" />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalSupply"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Total Supply
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="mt-1 block w-full"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deployOn"
                  render={({ field }) => (
                    <FormItem className="flex-col items-start text-start">
                      <FormLabel className="font-mitr text-lg font-bold">
                        Deploy on
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="">Select a chain</option>
                          <option value="scroll">Scroll</option>
                          <option value="morph">Morph</option>
                          <option value="base">Base</option>
                        </select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <div className="text-center">
                  <h2 className="mb-4 text-lg font-bold">Ready to send it?</h2>
                  {imagePreview && (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Selected"
                        className="mx-auto h-32 w-32 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="mx-auto grid max-w-md grid-cols-1 gap-4 text-left">
                    <div className="flex justify-between">
                      <span className="font-bold">Token Name:</span>
                      <span>{form.getValues("name")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Ticker:</span>
                      <span>{form.getValues("ticker")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Total Supply:</span>
                      <span>{form.getValues("totalSupply")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Description:</span>
                      <span>{form.getValues("description")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Twitter (X):</span>
                      <span>{form.getValues("twitter")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Telegram:</span>
                      <span>{form.getValues("telegram")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Deploy on:</span>
                      <span>{form.getValues("deployOn")}</span>
                    </div>
                  </div>
                  <Button type="submit" className="mt-8">
                    Launch on {form.getValues("deployOn")}
                  </Button>
                </div>
              </>
            )}
            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button
                  type="button"
                  onClick={
                    session
                      ? handleNextStep
                      : () => toast(notAuthenticatedToastProps)
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
