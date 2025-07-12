import React from "react";
import {
  X,
  Heart,
  Map,
  Home,
  Wifi,
  DollarSign,
  Plus,
  CheckCircle2,
  BadgeCheck,
  MapPin,
  Bath,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Apartment } from "../types";

interface ApartmentDetailsDrawerProps {
  apartment: Apartment | undefined;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (apartmentId: number) => void;
  onAddToSearchParty?: (apartmentId: number) => void;
}

export const ApartmentDetailsDrawer: React.FC<ApartmentDetailsDrawerProps> = ({
  apartment,
  isOpen,
  onClose,
  onAddToFavorites,
  onAddToSearchParty,
}) => {
  if (!apartment) return null;

  return (
    <>
      {/* Glass overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 top-[63px]"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-[63px] bottom-0 left-0 z-40 flex flex-col w-full md:w-2/3 lg:w-2/5 backdrop-blur-xl bg-white/80 border-r border-white/20 shadow-2xl transform transition-all duration-500 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Main Content */}
        <div className="text-neutral-800 leading-[20px] w-full max-w-7xl font-['Airbnb_Cereal_VF',_Circular,_-apple-system,_'system-ui',_Roboto,_'Helvetica_Neue',_sans-serif] flex flex-wrap justify-start items-stretch mx-auto px-20">
          <div className="w-[58.3333%] relative mx-[0%]">
            <div>
              <div>
                <div className="py-8">
                  <div>
                    <div className="contents">
                      <section>
                        <div className="leading-[26px] tracking-[-0.22px] text-[22px] font-medium">
                          <h2>{apartment.title}</h2>
                        </div>
                        <div className="mt-1">
                          <ol className="list-decimal">
                            <li className="inline-block text-left">
                              {apartment.bedrooms} bed
                            </li>
                            <li className="inline-block text-left">
                              <span>
                                <span className="whitespace-pre-wrap"> · </span>
                              </span>
                              {apartment.bathrooms} bath
                            </li>
                            <li className="inline-block text-left">
                              <span>
                                <span className="whitespace-pre-wrap"> · </span>
                              </span>
                              {apartment.squareFeet} sqft
                            </li>
                          </ol>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6">
                <div className="contents">
                  <div className="flex gap-6">
                    <div className="relative size-10">
                      <button
                        type="button"
                        className="bg-transparent block relative text-center underline cursor-pointer rounded-[50%] size-full"
                      >
                        <div className="bg-neutral-200 relative overflow-hidden cursor-pointer rounded-[50%] size-10">
                          <div
                            className="min-h-px bg-center inline-block no-repeat align-bottom cursor-pointer size-full"
                            role="presentation"
                          >
                            <img
                              className="max-w-none inline-block align-bottom object-cover cursor-pointer size-full"
                              alt="Host profile picture"
                              src="https://placehold.co/240x247"
                            />
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <div className="font-medium">
                        {" "}
                        Listed by: {apartment.listedBy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description Card */}
              <div className="border-t-neutral-200 border-t-[1.5px] pt-8 pb-12">
                <div className="whitespace-pre-wrap">
                  <div className="leading-[22px] overflow-hidden text-ellipsis">
                    <p>{apartment.description}</p>
                  </div>
                </div>
              </div>
              {/* Amenities Card */}
              <div className="border-t-neutral-200 border-t-[1.5px] py-12">
                <section>
                  <div className="pb-6">
                    <div className="leading-[26px] tracking-[-0.22px] text-[22px] font-medium">
                      <h2>What this place offers</h2>
                    </div>
                  </div>
                  <div className="w-[calc(100%_+_16px)] flex flex-wrap justify-start items-stretch mx-[-8px]">
                    {apartment?.amenities?.map((amenity, index) => (
                      <div
                        key={index}
                        className="w-1/2 relative mx-[0%] px-2"
                      >
                        <div className="pb-6 max-w-[83.3333%] flex flex-row-reverse justify-end items-center">
                          <div>{amenity}</div>
                          <div className="mr-4 min-w-6">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className="mr-[0%] ml-[8.33333%] w-[33.3333%] relative">
            <div className="pr-px w-full top-20 z-[1] inline-block sticky">
              <div className="pb-12">
                <div>
                  <div>
                    <div className="mt-8">
                      <div>
                        <div className="shadow-[_#0000001f_0px_6px_16px_0px] p-6 rounded-xl">
                          <div>
                            <div>
                              <div className="flex flex-col">
                                <div className="mb-6 gap-x-2 flex flex-wrap justify-between items-baseline">
                                  <div>
                                    <div className="flex flex-wrap items-baseline">
                                      <span className="flex relative items-baseline">
                                        <div>
                                          <div className="leading-[26px] text-[22px] flex flex-wrap justify-start items-baseline">
                                            <span className="block">
                                              <div className="inline-flex relative">
                                                <button
                                                  type="button"
                                                  className="bg-transparent block font-medium underline cursor-pointer rounded-sm"
                                                >
                                                  <span className="font-semibold cursor-pointer">
                                                    ${apartment.price}
                                                  </span>
                                                </button>
                                              </div>
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <span>/month</span>
                                        </div>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-[0]">
                                  <div>
                                    <Button
                                      className="text-white w-full bg-transparent bg-[linear-gradient(to_right,_rgb(230,_30,_77)_0%,_rgb(227,_28,_95)_50%,_rgb(215,_4,_102)_100%)] relative text-center font-medium overflow-hidden cursor-pointer px-6 py-[14px] rounded-[999px]"
                                      onClick={() =>
                                        onAddToFavorites?.(apartment.id)
                                      }
                                    >
                                      <span className="block relative cursor-pointer">
                                        <span className="cursor-pointer">
                                          Save
                                        </span>
                                      </span>
                                    </Button>
                                    <Button
                                      className="text-white w-full bg-transparent bg-[linear-gradient(to_right,_rgb(230,_30,_77)_0%,_rgb(227,_28,_95)_50%,_rgb(215,_4,_102)_100%)] relative text-center font-medium overflow-hidden cursor-pointer px-6 py-[14px] rounded-[999px] mt-2"
                                      onClick={() =>
                                        onAddToSearchParty?.(apartment.id)
                                      }
                                    >
                                      <span className="block relative cursor-pointer">
                                        <span className="cursor-pointer">
                                          Add to Search Party
                                        </span>
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentDetailsDrawer;