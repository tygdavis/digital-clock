import { useEffect, useRef, useState } from "react";

export default function Timer() {
// UI state
const [phase, setPhase] = useState("idle"); // "before" | "idle" | "running" | "paused"
const [remainingMs, setRemainingMs] = useState(0);
const [started, setStarted] = useState(false);
const [timerAtZero, setTimerAtZero] = useState(false);
// Inputs
const [inpMin, setInpMin] = useState(0);
const [inpSec, setInpSec] = useState(0);

// Internals
const targetRef = useRef(null);      // number | null (epoch ms when we hit 0)
const intervalRef = useRef(null);    // interval id

// Format mm:ss
const mm = String(Math.floor(remainingMs / 1000 / 60)).padStart(2, "0");
const ss = String(Math.floor((remainingMs / 1000) % 60)).padStart(2, "0");

// Tick while running
useEffect(() => {
if (phase !== "running") return;

intervalRef.current = setInterval(() => {
    const now = Date.now();
    const rem = Math.max(0, (targetRef.current ?? now) - now);
    setRemainingMs(rem);

    if (rem <= 0) {
        document.getElementById("timer-text").style.color = "red";
        setTimerAtZero(true);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        // Optional: vibrate or play a sound
        if (navigator.vibrate) navigator.vibrate(200);
    }
}, 200); // smooth-ish without being heavy

return () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
};
}, [phase]);

function start() {
// sanitize inputs
const mins = clampInt(inpMin, 0, 23_59); // not a real hours cap, just big
const secs = clampInt(inpSec, 0, 59);
const totalMs = (mins * 60 + secs) * 1000;
if (totalMs <= 0) return; // ignore zero

setRemainingMs(totalMs);
targetRef.current = Date.now() + totalMs;
setTimerAtZero(false);
setPhase("running");
}

function pause() {
if (phase !== "running") return;
setPhase("paused");
// keep remainingMs as-is; stop ticking via effect cleanup
}

function resume() {
if (phase !== "paused") return;
targetRef.current = Date.now() + remainingMs;
setPhase("running");
}

function reset() {
setPhase("idle");
setTimerAtZero(true);
setRemainingMs(0);
setStarted(false);
setInpMin(0);
setInpSec(0);
targetRef.current = null;
}

// Helpers to keep inputs valid
function clampInt(v, min, max) {
const n = Number.isFinite(+v) ? Math.trunc(+v) : 0;
return Math.min(max, Math.max(min, n));
}

return (
<div className="timer-shell">
    {!started && (
        <div>
            <button  className="timer-btn" onClick={() => setStarted(p => !p)}>Start Timer</button>
        </div>
    )}
    {(phase === "idle" && started) && (
    <form
        className="timer-form"
        onSubmit={(e) => {
        e.preventDefault();
        start();
        }}
    >
        <button type="button" className="cancel-btn" onClick={reset}>X</button>

        <label>
        Minutes
        <input
            type="number"
            min={0}
            value={inpMin}
            onChange={(e) => setInpMin(clampInt(e.target.value, 0, 9999))}
        />
        </label>
        <label>
        Seconds
        <input
            type="number"
            min={0}
            max={59}
            value={inpSec}
            onChange={(e) => setInpSec(clampInt(e.target.value, 0, 59))}
            placeholder="Seconds"
        />
        </label>

        <button type="submit" className="timer-btn">Start</button>
    </form>
    )}

    {phase !== "idle" && (
    <div className="timer-container">
        <p className="timer-text" id="timer-text" aria-live="polite">
        {mm}:{ss}
        </p>
        <div className="timer-controls">
        {!timerAtZero && (
            phase === "running"  ? (
                <button className="timer-btn pause" onClick={pause}>Pause</button>
            ) : (
                <button className="timer-btn resume" onClick={resume}>Resume</button>
            )
            )}
        <button className="timer-btn reset" onClick={reset}>Reset</button>
        </div>
    </div>
    )}
</div>
);
}
