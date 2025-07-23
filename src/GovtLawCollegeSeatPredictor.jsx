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

  const categoryList = useMemo(
    () => Object.keys(seatData[program].categories),
    [program]
  );

  const pickRankToTest = () => {
    const needsCat = !["State Merit", "PD"].includes(category);
    return needsCat && categoryRank ? parseInt(categoryRank, 10) : parseInt(overallRank, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!overallRank) return;

    const overall = parseInt(overallRank, 10);
    const stateCutoff = seatData[program].categories["State Merit"];

    if (overall > 0 && overall <= stateCutoff) {
      setGranted(true);
      return;
    }

    const testedRank = pickRankToTest();
    const cutoff = seatData[program].categories[category];
    setGranted(testedRank > 0 && testedRank <= cutoff);
  };

  return (
    <div className="mx-auto my-10 w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        Govt. Law College Eligibility Checker – CAP 2025
      </h1>

      {/* ── FORM ─ */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Programme */}
        <div className="space-y-2">
          <label htmlFor="program" className="block text-sm font-medium text-gray-700">
            Programme
          </label>
          <select
            id="program"
            value={program}
            onChange={(e) => {
              const val = e.target.value;
              setProgram(val);
              if (!seatData[val].categories[category]) setCategory("State Merit");
            }}
            className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="3yr">Three‑Year LL.B</option>
            <option value="5yr">Five‑Year Integrated LL.B</option>
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Reservation category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full rounded-md border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categoryList.map((c) => (
              <option key={c} value={c} className="truncate">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Ranks */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="overall" className="block text-sm font-medium text-gray-700">
              CEE overall rank *
            </label>
            <input
              id="overall"
              type="number"
              min="1"
              placeholder="Overall rank"
              value={overallRank}
              onChange={(e) => setOverallRank(e.target.value)}
              required
              className="h-12 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="catrank" className="block text-sm font-medium text-gray-700">
              Category rank
            </label>
            <input
              id="catrank"
              type="number"
              min="1"
              placeholder="Rank within category"
              value={categoryRank}
              onChange={(e) => setCategoryRank(e.target.value)}
              className="h-12 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        >
          Check eligibility
        </button>
      </form>

      {/* ── RESULT ─ */}
      {granted !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "mt-8 rounded-md border p-4 text-center text-sm font-medium",
            granted ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {granted
            ? "✅ You have a chance to get a Government law‑college seat."
            : "❌ No Government seat based on current ranks."}
        </motion.div>
      )}
    </div>
  );
}
