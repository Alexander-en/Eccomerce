"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

export default function CommonModal({
  modalTitle,
  mainContent,
  showButtons,
  buttonComponent,
  show,
  setShow,
  showModalTitle,
}) {
    
  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShow}>
        
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75" />
        </TransitionChild>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              
              {/* Sliding panel */}
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">

                    {/* Content */}
                    <div className="flex-1 px-4 mt-20 py-6 sm:px-6">
                      
                      {showModalTitle && (
                        <div className="flex justify-between items-center">
                          <DialogTitle className="block text-lg font-semibold text-black">
                            {modalTitle}
                          </DialogTitle>

                          {/* Close button */}
                          <button
                            onClick={() => setShow(false)}
                            className="text-gray-500 hover:text-black cursor-pointer text-2xl font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      <div className="mt-10">{mainContent}</div>
                    </div>

                    {/* Buttons */}
                    {showButtons && (
                      <div className="px-4 py-6 sm:px-6 ">
                        {buttonComponent}
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>

            </div>
          </div>
        </div>

      </Dialog>
    </Transition>
  );
}