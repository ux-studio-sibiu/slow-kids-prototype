"use server";

import writeClient from "@/sanity/sanity.write-client";

export type SignupResult = { success: true } | { success: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

// Saves one event signup as a Sanity `signup` document. Re-validates on the
// server (never trust the client) and links to the event via a reference.
export async function signupSubmit(formData: FormData): Promise<SignupResult> {
  const childName = formData.get("childName")?.toString().trim() || "";
  const parentName = formData.get("parentName")?.toString().trim() || "";
  const contactEmail = formData.get("contactEmail")?.toString().trim() || "";
  const contactPhone = formData.get("contactPhone")?.toString().trim() || "";
  const eventId = formData.get("eventId")?.toString().trim() || "";

  if (!eventId) return { success: false, error: "Eveniment lipsă." };
  if (!childName || !parentName) return { success: false, error: "Numele copilului și al părintelui sunt obligatorii." };
  if (!EMAIL_RE.test(contactEmail)) return { success: false, error: "Email invalid." };
  if (!PHONE_RE.test(contactPhone)) return { success: false, error: "Număr de telefon invalid." };

  try {
    await writeClient.create({
      _type: "signup",
      childName,
      parentName,
      contactEmail,
      contactPhone,
      event: { _type: "reference", _ref: eventId },
      submittedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("signupSubmit error:", error);
    return { success: false, error: "Înscrierea nu a putut fi salvată. Încercați din nou." };
  }
}
