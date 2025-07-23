import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// ── STATIC ASSETS ──
const logoSrc =
  "https://writs.in/wp/wp-content/uploads/2023/10/Black-Letters.png";
// 🔖  Better reliability: drop your poster image into the `/public` folder of this project
//     and rename it `poster.jpg`. Vercel will then serve https://<your‑site>/poster.jpg
//     with zero CORS / permissions issues.
const posterSrc = "/poster.jpg";

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

// Friendly labels mapping
const categoryLabels = {
  "State Merit": "State Merit",
  SC: "Scheduled Castes (SC)",
  ST: "Scheduled Tribes (ST)",
  "Ezhava (EZ)": "Ezhava (EZ)",
  "Muslim (MU)": "Muslim (MU)",
  OBH: "Other Backward Hindu (OBH)",
  "LC/AI": "Latin Catholic / Anglo‑Indian (LC/AI)",
  Dheevara: "Dheevara (DV)",
  Viswakarma: "Viswakarma (VI)",
  Kusavan: "Kusavan (KN)",
  OBX: "Other Backward Christian (OBX)",
  Kudumbi: "Kudumbi (KU)",
  PD: "Persons with Disabilities (PD)",
  EWS: "Economically Weaker Sections (EWS)",
};

export default function GovtLawCollegeSeatPredictor() {
  const [program, setProgram] = useState("3yr");
  const [category, setCategory] = useState("State Merit");
  const [overallRank, setOverallRank] = useState("");
  const [categoryRank, setCategoryRank] = useState("");
  const [granted, setGranted] = useState(null);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const categoryList = useMemo(
    () => Object.keys(seatData[program].categories),
    [program]
  );

  const pickRankToTest = () => {
    const needsCat = !["State Merit", "PD"].includes(category);
    return needsCat && categoryRank
      ? parseInt(categoryRank, 10)
      : parseInt(overallRank, 10);
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

 /* ────────────────────────────────────────────────────────────────── */
  /**  UI  **/
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      {/* ── DISCLAIMER MODAL ─ */}
      {!acceptedDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Disclaimer</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-700">
              This seat‑prediction tool is an <strong>experimental model</strong> built solely on the
              final rank and category data from the 2025 admission cycle. It does <strong>not</strong> replicate
              the real‑time procedures used by the Commissioner for Entrance Examinations (CEE)—including live
              rank lists, traveller rotation, and other dynamic CAP criteria.<br /><br />
            
              • If the tool indicates you <em>may</em> get a seat, that is <strong>not a guarantee</strong> of allotment.<br />
              • If the tool suggests you <em>may not</em> get a seat, it <strong>does not rule out</strong> the possibility that you still could.<br />
              • Actual admission outcomes depend entirely on the official CEE process and seat availability at the time of allotment.<br /><br />
            
              Writsfam Private Limited and the tool’s developers accept no liability for decisions made in reliance on these predictions.
              Always base your choices on the <strong>official notifications and rank lists issued by CEE Kerala</strong>.
            </p>
            <button
              onClick={() => setAcceptedDisclaimer(true)}
              className="h-10 w-full rounded-md bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              I understand &amp; agree
            </button>
          </div>
        </div>
      )}

      {/* ── BRANDING ─ */}
      <div className="mb-6 flex justify-center">
        <img src={logoSrc} alt="WRITS logo" className="h-24 w-auto select-none" />
      </div>

      {/* ── PREDICTOR CARD ─ */}
      <div className="mx-auto w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
          WRITS Govt. Law College Seat Predictor 2025
        </h2>

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

        {/* ── SHORT DISCLAIMER ─ */}
        <p className="mt-6 text-center text-xs text-gray-500">
          * Predictor for guidance only; does not guarantee a seat. Final
          allotment is as per CEE.
        </p>

        {/* ── RESULT ─ */}
        {granted !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "mt-6 rounded-md border p-4 text-center text-sm font-medium",
              granted
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            {granted
              ? "✅ You have a chance to get a Government law‑college seat."
              : "❌ No Government seat based on current ranks."}
          </motion.div>
        )}
      </div>

      {/* ── COURSE POSTER ─ */}
      <div className="mx-auto mt-12 flex max-w-lg justify-center">
        <img
          src={posterSrc}
          alt="WRITS upcoming course poster"
          className="w-full rounded-lg shadow-lg"
          loading="lazy"
          onError={(e) => {
            // hide broken img icon if poster not found
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    </div>
  );
}
