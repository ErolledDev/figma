import { SendIcon, XIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const Options = (): JSX.Element => {
  // Chat message data
  const chatMessages = [
    {
      id: 1,
      text: "👋 Want to chat about HubSpot? I'm an AI chatbot here to help you find your way.",
    },
    {
      id: 2,
      text: "Ask me or select an option below.",
    },
  ];

  // Option buttons data
  const optionButtons = [
    {
      id: 1,
      text: "✏ Get free training",
    },
    {
      id: 2,
      text: "💬 Chat with the sales team",
    },
    {
      id: 3,
      text: "🚀 Get started free",
    },
  ];

  return (
    <main className="bg-[#b7ecec] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#b7ecec] w-full max-w-[1440px] h-[1024px] relative">
        {/* Floating action button */}
        <Button
          className="fixed w-[60px] h-[60px] bottom-[16px] right-[16px] rounded-full p-0"
          variant="default"
        >
          <img
            className="w-full h-full"
            alt="Floating action"
            src="public/floating-action-button.svg"
          />
        </Button>

        {/* Chat widget */}
        <Card className="w-[376px] fixed top-[402px] right-[16px] shadow-dropshadow overflow-hidden">
          <CardHeader className="p-0 space-y-0">
            <div className="relative h-[68px] bg-[#33475b] rounded-t-lg flex items-center">
              <div className="absolute w-[37px] h-[33px] top-4 left-4">
                <div className="relative w-[38px] h-[34px]">
                  <Avatar className="absolute w-8 h-8 top-0 left-0">
                    <AvatarImage
                      src="public/ellipse-5-1.png"
                      alt="HubBot"
                      className="object-cover"
                    />
                    <AvatarFallback>HB</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute w-[13px] h-[13px] top-[21px] left-[25px] bg-[#00bda5] rounded-[6.5px] border-2 border-solid border-white p-0" />
                </div>
              </div>
              <span className="absolute top-[22px] left-[66px] font-normal text-white text-base leading-[26px]">
                HubBot
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative w-full h-[310px] bg-white p-4">
              {/* Chat messages */}
              {chatMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`inline-flex items-center justify-center gap-2.5 px-4 py-2 absolute ${
                    index === 0 ? "top-8" : "top-32"
                  } left-[58px] bg-[#eaf0f6] rounded-[0px_8px_8px_8px]`}
                >
                  <div className="relative w-[252px] mt-[-1.00px] font-normal text-[#425b76] text-sm leading-6">
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Option buttons */}
              <div className="absolute top-[180px] left-[58px]">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-sm border border-solid border-[#2e475d] h-auto"
                >
                  <span className="font-normal text-[#2e475d] text-xs leading-4 whitespace-nowrap">
                    {optionButtons[0].text}
                  </span>
                </Button>
              </div>

              <div className="absolute top-[220px] left-[58px]">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-sm border border-solid border-[#2e475d] h-auto"
                >
                  <span className="font-normal text-[#2e475d] text-xs leading-4 whitespace-nowrap">
                    {optionButtons[1].text}
                  </span>
                </Button>
              </div>

              <div className="absolute top-[180px] left-[200px]">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-sm border border-solid border-[#2e475d] h-auto"
                >
                  <span className="font-normal text-[#2e475d] text-xs leading-4 whitespace-nowrap">
                    {optionButtons[2].text}
                  </span>
                </Button>
              </div>

              <Avatar className="absolute w-8 h-8 top-[18px] left-[18px]">
                <AvatarImage
                  src="public/ellipse-5-1.png"
                  alt="HubBot"
                  className="object-cover"
                />
                <AvatarFallback>HB</AvatarFallback>
              </Avatar>
            </div>

            <div className="relative w-full h-24 bg-white" />
          </CardContent>

          <CardFooter className="flex items-center gap-2 p-2 w-full bg-white rounded-b-lg border-t-2 border-[#f2f5f8] min-h-[60px]">
            <div className="flex w-[312px] h-[38px] items-center gap-2.5 p-2 relative">
              <Input
                className="border-none shadow-none font-normal text-[#8498b6] text-base leading-[22px]"
                placeholder="Write a message"
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-[20px] flex items-center justify-center"
            >
              <SendIcon className="w-[18px] h-[18px]" />
            </Button>
          </CardFooter>
        </Card>

        {/* Privacy policy footer */}
        <div className="flex w-[380px] items-start justify-end gap-2.5 px-6 py-3 fixed top-[778px] right-[16px] bg-white border-t-2 border-[#f2f5f8]">
          <div className="relative flex-1 font-normal text-xs tracking-[0] leading-3">
            <span className="text-[#425b76] leading-[0.1px]">
              HubSpot uses the information you provide to us to contact you
              about our relevant content, products, and services. You may
              unsubscribe from these communications at any time. For more
              information, check out our{" "}
            </span>

            <a
              href="https://legal.hubspot.com/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
              className="font-bold text-[#425b76] leading-[18px] underline"
            >
              privacy policy
            </a>

            <span className="font-bold text-[#425b76] leading-[0.1px]">.</span>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="absolute w-7 h-7 top-2 right-2 p-0"
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>
  );
};
