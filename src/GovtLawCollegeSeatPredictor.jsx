import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

/*
  GOVT‑QUOTA SEAT MATRIX (CAP 2025)
  ────────────────────────────────
  Keys: programme → category → last admitted seat no.
*/
const seatData = {
  "3yr": {
    categories: {
      "State Merit": 251,
      SC: 38,
      ST: 8,
      "Ezhava (EZ)": 76,
      "Muslim (MU)": 60,
      OBH: 20,
      "LC/AI": 19,
      Dheevara: 11,
      Viswakarma: 11,
      Kusavan: 4,
      OBX: 4,
      Kudumbi: 4,
      PD: 23,
      EWS: 46,
    },
  },
  "5yr": {
    categories: {
      "State Merit": 194,
      SC: 29,
      ST: 6,
      "Ezhava (EZ)": 54,
      "Muslim (MU)": 68,
      OBH: 18,
      "LC/AI": 17,
      Dheevara: 8,
      Viswakarma: 10,
      Kusavan: 3,
      OBX: 3,
      Kudumbi: 3,
      PD: 18,
      EWS: 36,
    },
  },
};

export default function GovtLawCollegeSeatPredictor() {
  const [program, setProgram] = useState("3yr");
  const [category, setCategory] = useState("State Merit");
  const [overallRank, setOverallRank] = useState("");
  const [categoryRank, setCategoryRank] = useState("");
  const [granted, setGranted] = useState(null);

  // update category options when programme changes
  const categoryList = useMemo(
    () => Object.keys(seatData[program].categories),
    [program]
  );

  const pickRankToTest = () => {
    // Most quotas (incl. EWS) are awarded by **category‑wise rank**.
    // Only State‑Merit and PD use the overall rank list directly.
    const needsCat = !["State Merit", "PD"].includes(category);
    return needsCat && categoryRank ? parseInt(categoryRank, 10) : parseInt(overallRank, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!overallRank) return; // overall is mandatory

    const overall = parseInt(overallRank, 10);
    const stateCutoff = seatData[program].categories["State Merit"];

    // if within state‑merit, always granted
    if (overall > 0 && overall <= stateCutoff) {
      setGranted(true);
      return;
    }

    const testedRank = pickRankToTest();
    const cutoff = seatData[program].categories[category];
    setGranted(testedRank > 0 && testedRank <= cutoff);
  };

  return (
    <Card className="mx-auto my-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-0 shadow-xl ring-1 ring-gray-200">
      <CardContent className="space-y-8 p-8">
        <h1 className="text-center text-2xl font-semibold">Govt. Law College Eligibility Checker – CAP 2025</h1>

        {/* ── FORM ─ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Programme */}
          <div className="space-y-2">
            <Label htmlFor="program">Programme</Label>
            <Select
              value={program}
              onValueChange={(val) => {
                setProgram(val);
                // reset category if not available in new programme
                if (!seatData[val].categories[category]) setCategory("State Merit");
              }}
            >
              <SelectTrigger id="program" className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-left focus:outline-none [&_svg]:hidden">
                <SelectValue placeholder="Select programme" className="truncate" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} align="start" className="z-[9999] w-[var(--radix-select-trigger-width)] rounded-md border border-gray-200 bg-white shadow-lg">
                <SelectItem value="3yr" className="truncate text-sm">Three‑Year LL.B</SelectItem>
                <SelectItem value="5yr" className="truncate text-sm">Five‑Year Integrated LL.B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Reservation category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-left focus:outline-none [&_svg]:hidden">
                <SelectValue placeholder="Select category" className="truncate" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} align="start" className="z-[9999] max-h-64 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {categoryList.map((c) => (
                  <SelectItem key={c} value={c} className="truncate text-sm">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ranks */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="overall">CEE overall rank *</Label>
              <Input
                id="overall"
                type="number"
                min="1"
                placeholder="Overall rank"
                value={overallRank}
                onChange={(e) => setOverallRank(e.target.value)}
                required
                className="h-12 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catrank">Category rank</Label>
              <Input
                id="catrank"
                type="number"
                min="1"
                placeholder="Rank within category"
                value={categoryRank}
                onChange={(e) => setCategoryRank(e.target.value)}
                className="h-12 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <Button type="submit" className="h-12 w-full rounded-md bg-red-600 font-semibold text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500">
            Check eligibility
          </Button>
        </form>

        {/* ── RESULT ─ */}
        {granted !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert variant={granted ? "default" : "destructive"} className="text-center font-medium">
              <AlertTitle>
                {granted ? "✅ You have a chance to get a Government law‑college seat." : "❌ No Government seat based on current ranks."}
              </AlertTitle>
            </Alert>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
