import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Flex, Select, Stack, Text, TextInput } from "@sanity/ui";
import { useClient } from "sanity";
import "./signups-summary.scss";

type SignupEvent = { _id: string; title?: string; date?: string };

type SignupEntry = {
  _id: string;
  _createdAt?: string;
  childName?: string;
  parentName?: string;
  contactEmail?: string;
  contactPhone?: string;
  submittedAt?: string;
  event?: SignupEvent | null;
};

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()} (${hh}:${min})`;
}

function toTsvCell(value?: string) {
  if (!value) return "";
  const escaped = value.replace(/"/g, '""');
  return /[\t\n"]/.test(escaped) ? `"${escaped}"` : escaped;
}

export default function SignupsSummary() {
  const client = useClient({ apiVersion: "2025-07-14" });
  const [entries, setEntries] = useState<SignupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [highlightDuplicates, setHighlightDuplicates] = useState(false);
  const [copyEmailsLabel, setCopyEmailsLabel] = useState("Copiază emailuri");
  const [copyPhonesLabel, setCopyPhonesLabel] = useState("Copiază telefoane");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await client.fetch<SignupEntry[]>(
        `*[_type == "signup"] | order(submittedAt desc, _createdAt desc){
          _id, _createdAt, childName, parentName, contactEmail, contactPhone, submittedAt,
          "event": event->{_id, title, date}
        }`,
      );
      setEntries(data || []);
    } catch {
      setErrorMessage("Nu am putut încărca înscrierile.");
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Events that actually have signups, for the filter dropdown.
  const eventOptions = useMemo(() => {
    const byId = new Map<string, SignupEvent>();
    entries.forEach((e) => {
      if (e.event?._id) byId.set(e.event._id, e.event);
    });
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    );
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      if (selectedEventId && entry.event?._id !== selectedEventId) return false;
      if (!q) return true;
      const haystack = [
        entry.childName,
        entry.parentName,
        entry.contactEmail,
        entry.contactPhone,
        entry.event?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, searchQuery, selectedEventId]);

  const duplicateEmails = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEntries.forEach((e) => {
      const email = e.contactEmail?.trim().toLowerCase();
      if (email) counts[email] = (counts[email] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter((k) => counts[k] > 1));
  }, [filteredEntries]);

  const filteredEmails = useMemo(
    () => [...new Set(filteredEntries.map((e) => e.contactEmail?.trim()).filter(Boolean) as string[])],
    [filteredEntries],
  );
  const filteredPhones = useMemo(
    () => [...new Set(filteredEntries.map((e) => e.contactPhone?.trim()).filter(Boolean) as string[])],
    [filteredEntries],
  );

  const tsvText = useMemo(() => {
    const header = ["Copil", "Părinte", "Email", "Telefon", "Eveniment", "Data înscrierii"].join("\t");
    const rows = filteredEntries.map((e) =>
      [
        toTsvCell(e.childName),
        toTsvCell(e.parentName),
        toTsvCell(e.contactEmail),
        toTsvCell(e.contactPhone),
        toTsvCell(e.event?.title),
        toTsvCell(formatDate(e.submittedAt || e._createdAt)),
      ].join("\t"),
    );
    return [header, ...rows].join("\n");
  }, [filteredEntries]);

  const copyText = useCallback(
    async (text: string, setLabel: (s: string) => void, base: string, count: number) => {
      try {
        await navigator.clipboard.writeText(text);
        setLabel(`Copiat! (${count})`);
        setTimeout(() => setLabel(base), 2000);
      } catch {
        setErrorMessage("Copierea a eșuat.");
      }
    },
    [],
  );

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const allFilteredChecked =
    filteredEntries.length > 0 && filteredEntries.every((e) => checkedIds.has(e._id));

  const toggleCheckAll = useCallback(() => {
    setCheckedIds(() => (allFilteredChecked ? new Set() : new Set(filteredEntries.map((e) => e._id))));
  }, [allFilteredChecked, filteredEntries]);

  const deleteIds = useCallback(
    async (ids: string[], confirmMsg: string) => {
      if (ids.length === 0) return;
      if (!window.confirm(confirmMsg)) return;
      try {
        setIsDeleting(true);
        setErrorMessage(null);
        const tx = client.transaction();
        ids.forEach((id) => tx.delete(id));
        await tx.commit();
        const removed = new Set(ids);
        setEntries((prev) => prev.filter((e) => !removed.has(e._id)));
        setCheckedIds(new Set());
      } catch {
        setErrorMessage("Ștergerea a eșuat.");
      } finally {
        setIsDeleting(false);
      }
    },
    [client],
  );

  return (
    <Card padding={4} sizing="border" className="nsc-signups-summary">
      <Stack space={4}>
        <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
          <Text size={2} weight="semibold">Sumar înscrieri</Text>
          <Text size={1} muted>{filteredEntries.length} / {entries.length} înscrieri</Text>
        </Flex>

        <Flex gap={2} wrap="wrap">
          <Box flex={1} style={{ minWidth: 260 }}>
            <TextInput
              placeholder="Caută după copil, părinte, email, telefon…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </Box>
          <Box style={{ minWidth: 240 }}>
            <Select value={selectedEventId} onChange={(e) => setSelectedEventId(e.currentTarget.value)}>
              <option value="">Toate evenimentele</option>
              {eventOptions.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title || "Eveniment"}{ev.date ? ` · ${new Date(ev.date).toLocaleDateString("ro-RO")}` : ""}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>

        {isLoading && <Text size={1}>Se încarcă…</Text>}
        {errorMessage && (
          <Text size={1} style={{ color: "var(--card-badge-critical-fg-color)" }}>{errorMessage}</Text>
        )}

        {!isLoading && !errorMessage && (
          <Box className="table-panel">
            <Box className="table-wrap">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th style={{ width: 36, textAlign: "center" }}>
                      <input type="checkbox" checked={allFilteredChecked} onChange={toggleCheckAll} />
                    </th>
                    <th>#</th>
                    <th>Copil</th>
                    <th>Părinte</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Eveniment</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, i) => {
                    const isDup =
                      highlightDuplicates &&
                      !!entry.contactEmail &&
                      duplicateEmails.has(entry.contactEmail.trim().toLowerCase());
                    return (
                      <tr key={entry._id}>
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" checked={checkedIds.has(entry._id)} onChange={() => toggleCheck(entry._id)} />
                        </td>
                        <td className="cell-num">{i + 1}</td>
                        <td>{entry.childName}</td>
                        <td>{entry.parentName}</td>
                        <td style={isDup ? { color: "var(--card-badge-critical-fg-color)", fontWeight: 600 } : undefined}>
                          {entry.contactEmail}
                        </td>
                        <td>{entry.contactPhone}</td>
                        <td className="cell-event">{entry.event?.title}</td>
                        <td>{formatDate(entry.submittedAt || entry._createdAt)}</td>
                      </tr>
                    );
                  })}
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "1rem" }}>
                        {searchQuery || selectedEventId ? "Niciun rezultat pentru filtrele curente." : "Nicio înscriere."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>

            <Flex className="footer-bar" align="center" justify="space-between" gap={2} wrap="wrap">
              <Flex as="label" align="center" gap={2} style={{ cursor: duplicateEmails.size === 0 ? "default" : "pointer", opacity: duplicateEmails.size === 0 ? 0.4 : 1 }}>
                <input type="checkbox" checked={highlightDuplicates} onChange={() => setHighlightDuplicates((v) => !v)} disabled={duplicateEmails.size === 0} />
                <Text size={1} muted>Vezi duplicate (email)</Text>
              </Flex>
              <Flex gap={2} align="center" wrap="wrap">
                <Button mode="ghost" text={copyEmailsLabel} disabled={filteredEmails.length === 0} onClick={() => copyText(filteredEmails.join(", "), setCopyEmailsLabel, "Copiază emailuri", filteredEmails.length)} />
                <Button mode="ghost" text={copyPhonesLabel} disabled={filteredPhones.length === 0} onClick={() => copyText(filteredPhones.join(", "), setCopyPhonesLabel, "Copiază telefoane", filteredPhones.length)} />
                <Button mode="ghost" text="Copiază tabel (TSV)" disabled={filteredEntries.length === 0} onClick={() => copyText(tsvText, () => {}, "", 0)} />
                <Button className="delete-btn" tone="critical" disabled={isDeleting || checkedIds.size === 0} text={`Șterge selectate (${checkedIds.size})`} onClick={() => deleteIds(Array.from(checkedIds), `Ștergi cele ${checkedIds.size} înscrieri selectate?`)} />
              </Flex>
            </Flex>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
