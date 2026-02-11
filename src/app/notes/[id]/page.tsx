"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [note, setNote] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  /* ======================
     FETCH NOTE + USER
  ====================== */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const noteRes = await axios.get(`/api/users/notes/${id}`);
        const noteData = noteRes.data.data;

        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
        setImages(noteData.images || []);

        try {
          const userRes = await axios.get("/api/users/me");
          setCurrentUser(userRes.data.data);
        } catch {
          setCurrentUser(null);
        }
      } catch {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ======================
     FIXED OWNER CHECK
  ====================== */
  const isOwner =
    currentUser?._id &&
    note?.user?._id &&
    String(currentUser._id) === String(note.user._id);

  /* ======================
     SAVE CHANGES
  ====================== */
  const saveChanges = async () => {
    try {
      setSaving(true);

      const res = await axios.put(`/api/users/notes/${id}`, {
        title,
        content,
        images,
      });

      setNote(res.data.data);
      setEditing(false);
      toast.success("Note updated ✨");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ======================
     DELETE NOTE
  ====================== */
  const deleteNote = async () => {
    if (!confirm("Delete this note permanently?")) return;

    try {
      await axios.delete(`/api/users/notes/${id}`);
      toast.success("Note deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ======================
     DOWNLOAD PDF
  ====================== */
  const downloadNote = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial";
    element.style.color = "black";
    element.style.background = "white";

    element.innerHTML = `
      <h1>${note.title}</h1>
      <p style="white-space: pre-wrap; margin-top:10px;">
        ${note.content}
      </p>
      <div id="pdf-images" style="margin-top:20px;"></div>
    `;

    document.body.appendChild(element);

    const imageContainer = element.querySelector("#pdf-images");

    await Promise.all(
      images.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.style.width = "100%";
            img.style.marginTop = "15px";

            img.onload = () => {
              imageContainer?.appendChild(img);
              resolve();
            };

            img.onerror = () => resolve();
          })
      )
    );

    await html2pdf()
      .set({
        margin: 10,
        filename: `${note.title || "note"}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
      })
      .from(element)
      .save();

    document.body.removeChild(element);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (!note)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Note not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14002b] via-[#1f0036] to-black text-white px-4 py-8">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">

          {/* TITLE */}
          {!editing ? (
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {note.title}
            </h1>
          ) : (
            <input
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}

          {/* CONTENT */}
          {!editing ? (
            <p className="text-purple-200 whitespace-pre-wrap leading-relaxed mb-6">
              {note.content}
            </p>
          ) : (
            <textarea
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 mb-6"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {/* IMAGES */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden group relative cursor-pointer"
                >
                  <img
                    src={img}
                    onClick={() => setZoomImg(img)}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-white/10">

            <button
              onClick={() => router.back()}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              ← Back
            </button>

            <button
              onClick={downloadNote}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition"
            >
              Download PDF
            </button>

            {isOwner && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
              >
                Edit
              </button>
            )}

            {isOwner && editing && (
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}

            {isOwner && (
              <button
                onClick={deleteNote}
                className="ml-auto px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ZOOM */}
      {zoomImg && (
        <div
          onClick={() => setZoomImg(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <img
            src={zoomImg}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
