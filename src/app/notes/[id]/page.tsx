"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/notes/${params.id}`).then((res) => {
      setNote(res.data);
      setLoading(false);
    });
  }, [params.id]);

  const saveNote = async () => {
    await axios.put(`/api/notes/${params.id}`, {
      title: note.title,
      content: note.content,
    });
    alert("Saved ✨");
  };

  const deleteNote = async () => {
    await axios.delete(`/api/notes/${params.id}`);
    router.push("/dashboard");
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="max-w-3xl mx-auto space-y-4">
        <input
          className="w-full bg-transparent text-3xl font-bold outline-none"
          value={note.title}
          onChange={(e) =>
            setNote({ ...note, title: e.target.value })
          }
        />

        <textarea
          className="w-full min-h-[300px] bg-white/5 p-4 rounded-xl outline-none"
          value={note.content}
          onChange={(e) =>
            setNote({ ...note, content: e.target.value })
          }
        />

        <div className="flex gap-4">
          <button
            onClick={saveNote}
            className="px-4 py-2 bg-purple-600 rounded-lg"
          >
            Save
          </button>

          <button
            onClick={deleteNote}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
