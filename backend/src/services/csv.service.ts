import { createObjectCsvStringifier } from "csv-writer";
import type { LeadResponse } from "../utils/serialize-lead.js";

const leadCsvStringifier = createObjectCsvStringifier({
  header: [
    { id: "name", title: "Name" },
    { id: "email", title: "Email" },
    { id: "status", title: "Status" },
    { id: "source", title: "Source" },
    { id: "createdAt", title: "Created At" }
  ]
});

type LeadCsvRecord = {
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
};

export const csvService = {
  buildLeadsCsv(leads: LeadResponse[]): string {
    const records: LeadCsvRecord[] = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt.toISOString()
    }));

    return leadCsvStringifier.getHeaderString() + leadCsvStringifier.stringifyRecords(records);
  }
};
