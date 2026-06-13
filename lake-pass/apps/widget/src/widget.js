const API_BASE = "http://localhost:8000/api/v1";

function init() {
  const container = document.getElementById("lakepass-widget");
  if (!container) return;

  const marina = container.dataset.marina || "marina-a";
  const apiUrl = container.dataset.api ? `${container.dataset.api}/api/v1` : API_BASE;

  const shadow = container.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      * { box-sizing: border-box; font-family: system-ui, sans-serif; }
      .lp { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; max-width: 400px; background: #fff; }
      .lp h3 { margin: 0 0 12px; color: #0369a1; }
      select, input, button { width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
      button { background: #0284c7; color: #fff; border: none; cursor: pointer; font-weight: 600; }
      button:hover { background: #0369a1; }
      .boat { padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
      .boat:hover, .boat.selected { border-color: #0284c7; background: #f0f9ff; }
      .msg { font-size: 13px; padding: 8px; border-radius: 6px; margin-bottom: 8px; }
      .ok { background: #f0fdf4; color: #166534; }
      .err { background: #fef2f2; color: #991b1b; }
      .hidden { display: none; }
    </style>
    <div class="lp">
      <h3>Book a Boat</h3>
      <div id="step1">
        <div id="boats"></div>
        <input type="date" id="start" />
        <input type="date" id="end" />
        <button id="check">Check Availability</button>
        <div id="avail-msg"></div>
      </div>
      <div id="step2" class="hidden">
        <input id="name" placeholder="Your name" />
        <input id="email" type="email" placeholder="Email" />
        <input id="phone" placeholder="Phone (optional)" />
        <button id="book">Book & Pay Deposit</button>
      </div>
      <div id="step3" class="hidden">
        <div class="msg ok">Booking confirmed! Check your email.</div>
      </div>
    </div>
  `;

  let selectedBoat = null;
  let totalAmount = 0;

  fetch(`${apiUrl}/public/marinas/${marina}/boats`)
    .then((r) => r.json())
    .then((boats) => {
      const el = shadow.getElementById("boats");
      boats.forEach((b) => {
        const div = document.createElement("div");
        div.className = "boat";
        div.innerHTML = `<strong>${b.name}</strong><br><small>${b.type} · $${b.pricePerDay}/day</small>`;
        div.onclick = () => {
          shadow.querySelectorAll(".boat").forEach((x) => x.classList.remove("selected"));
          div.classList.add("selected");
          selectedBoat = b._id;
        };
        el.appendChild(div);
      });
    });

  shadow.getElementById("check").onclick = async () => {
    const start = shadow.getElementById("start").value;
    const end = shadow.getElementById("end").value;
    const msg = shadow.getElementById("avail-msg");
    if (!selectedBoat || !start || !end) {
      msg.className = "msg err";
      msg.textContent = "Select a boat and dates";
      return;
    }
    const r = await fetch(`${apiUrl}/public/boats/${selectedBoat}/check-availability?startDate=${start}&endDate=${end}`);
    const data = await r.json();
    if (data.available) {
      totalAmount = data.totalAmount;
      msg.className = "msg ok";
      msg.textContent = `Available! Total: $${data.totalAmount}`;
      shadow.getElementById("step2").classList.remove("hidden");
    } else {
      msg.className = "msg err";
      msg.textContent = data.conflicts?.join(", ") || "Not available";
    }
  };

  shadow.getElementById("book").onclick = async () => {
    const name = shadow.getElementById("name").value;
    const email = shadow.getElementById("email").value;
    const phone = shadow.getElementById("phone").value;
    const start = shadow.getElementById("start").value;
    const end = shadow.getElementById("end").value;

    const r = await fetch(`${apiUrl}/public/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boatId: selectedBoat,
        startDate: start,
        endDate: end,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      }),
    });
    if (r.ok) {
      shadow.getElementById("step1").classList.add("hidden");
      shadow.getElementById("step2").classList.add("hidden");
      shadow.getElementById("step3").classList.remove("hidden");
    } else {
      const err = await r.json();
      alert(err.message || "Booking failed");
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Auto-init for script tag embeds
if (typeof window !== "undefined") {
  window.LakePassWidget = { init };
}
