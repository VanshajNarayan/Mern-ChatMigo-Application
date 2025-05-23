// ! packages:-
import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

// ! call send message method from zustand chat store:-
import { useChatStore } from "../store/useChatStore.js";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ? handle send message using zustand store:-
  const { sendMessage } = useChatStore();

  // ? handle image upload:-
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ? handle remove image:-
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ? handle send message:-
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // ? Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message:", error);
    }
  };

  return (
    <>
      <div className="w-full p-4">
        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="size-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
                onClick={handleRemoveImage}>
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* FORM FOR THE MESSAGE AND IMAGE FILE */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              name=""
              id=""
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className={`hidden sm:flex btn btn-circle ${
                imagePreview ? "text-emerald-500" : "text-zinc-400"
              }`}
              onClick={() => fileInputRef.current?.click()}>
              <Image size={20} />
            </button>
          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            className="btn btn-sm btn-circle cursor-pointer"
            disabled={!text.trim() && !imagePreview}>
            <Send size={22} />
          </button>
        </form>
      </div>
    </>
  );
};

export default MessageInput;
