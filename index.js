// Progress bar
window.addEventListener("scroll", () => {
	const winScroll =
		document.body.scrollTop || document.documentElement.scrollTop;
	const height =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	const scrolled = (winScroll / height) * 100;
	document.getElementById("progressBar").style.width = scrolled + "%";
});

// Example 1: Shopping Cart
let cart = [];
const products = {
	laptop: { name: "Laptop", price: 999 },
	phone: { name: "Phone", price: 699 },
	book: { name: "Book", price: 15 },
	headphones: { name: "Headphones", price: 199 },
};

function addToCart() {
	const select = document.getElementById("itemSelect");
	const product = products[select.value];
	cart.push({ ...product, id: Date.now() });
	updateCartDisplay();
}

function clearCart() {
	cart = [];
	updateCartDisplay();
}

function updateCartDisplay() {
	const output = document.getElementById("cartOutput");
	if (cart.length === 0) {
		output.textContent =
			"Cart is empty. Add items to see higher-order functions in action...";
		return;
	}

	// Using higher-order functions
	const withTax = cart.map((item) => ({
		...item,
		priceWithTax: (item.price * 1.1).toFixed(2),
	}));

	const expensiveItems = cart.filter((item) => item.price > 100);
	const total = cart.reduce((sum, item) => sum + item.price, 0);
	const avgPrice = total / cart.length;

	output.innerHTML = `🛒 Cart Items (${cart.length}):
${withTax.map((item) => `• ${item.name}: $${item.price} → $${item.priceWithTax} (with tax)`).join("\n")}

📊 Analysis:
• Expensive items (>$100): ${expensiveItems.length} (${expensiveItems.map((i) => i.name).join(", ")})
• Total: $${total}
• Average: $${avgPrice.toFixed(2)}`;
}

// Example 2: Pipeline
const pipe =
	(...fns) =>
	(x) =>
		fns.reduce((v, f) => f(v), x);
const trim = (str) => str.trim();
const toLower = (str) => str.toLowerCase();
const removeSpecialChars = (str) => str.replace(/[^a-z0-9]/g, "");
const addPrefix = (prefix) => (str) => `${prefix}_${str}`;
const limitLength = (str) => str.slice(0, 20);

function sanitize() {
	const input = document.getElementById("usernameInput").value;
	const output = document.getElementById("pipelineOutput");

	if (!input) {
		output.textContent = "Please enter a username";
		output.classList.add("error");
		return;
	}

	output.classList.remove("error");

	const steps = [
		{ name: "Original", fn: (x) => x, result: input },
		{ name: "trim()", fn: trim, result: trim(input) },
		{ name: "toLowerCase()", fn: toLower, result: toLower(trim(input)) },
		{
			name: 'replace(/[^a-z0-9]/g, "")',
			fn: removeSpecialChars,
			result: removeSpecialChars(toLower(trim(input))),
		},
		{
			name: 'addPrefix("user")',
			fn: addPrefix("user"),
			result: addPrefix("user")(removeSpecialChars(toLower(trim(input)))),
		},
		{
			name: "slice(0, 20)",
			fn: limitLength,
			result: limitLength(
				addPrefix("user")(removeSpecialChars(toLower(trim(input)))),
			),
		},
	];

	const sanitizeUsername = pipe(
		trim,
		toLower,
		removeSpecialChars,
		addPrefix("user"),
		limitLength,
	);
	const final = sanitizeUsername(input);

	output.innerHTML = `🔧 Pipeline Transformation:
${steps.map((step, i) => `${i + 1}. ${step.name.padEnd(25)} → "${step.result}"`).join("\n")}

✅ Final Result: "${final}"`;
}

// Example 3: Factory
let currentCalculator = null;

function createDiscountCalculator() {
	const rate = parseFloat(document.getElementById("discountRate").value);
	const output = document.getElementById("factoryOutput");

	if (!rate || rate <= 0 || rate > 100) {
		output.textContent = "❌ Please enter a valid discount rate (1-100)";
		output.classList.add("error");
		return;
	}

	output.classList.remove("error");

	// Factory function with closure
	currentCalculator = (function (discountPercent) {
		let usageCount = 0;
		const rate = discountPercent / 100;

		return {
			calculate: function (price) {
				usageCount++;
				const discount = price * rate;
				return {
					original: price,
					discount: discount.toFixed(2),
					final: (price - discount).toFixed(2),
					count: usageCount,
				};
			},
			getRate: () => discountPercent,
			getUsageCount: () => usageCount,
		};
	})(rate);

	document.getElementById("calcControls").style.display = "flex";
	output.innerHTML = `✅ Calculator created with ${rate}% discount rate!
🔒 Private state: usageCount = 0 (closed over)
📊 Rate is fixed at: ${rate * 100}%

Enter a price to calculate discount...`;
}

function calculateDiscount() {
	const price = parseFloat(document.getElementById("originalPrice").value);
	const output = document.getElementById("factoryOutput");

	if (!price || price <= 0) {
		output.textContent = "❌ Please enter a valid price";
		output.classList.add("error");
		return;
	}

	const result = currentCalculator.calculate(price);
	output.innerHTML = `💰 Calculation #${result.count}:
• Original Price: $${result.original}
• Discount (${currentCalculator.getRate()}%): $${result.discount}
• Final Price: $${result.final}

🔒 Closure maintains usage count: ${result.count} calls made`;
}

// Example 4: Debounce
let normalCount = 0;
let debounceCount = 0;
let debounceTimer;

const debounce = (fn, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const debouncedSearch = debounce((query) => {
	debounceCount++;
	document.getElementById("debounceOutput").textContent =
		`${debounceCount} calls (last: "${query}")`;
}, 300);

document.getElementById("searchInput").addEventListener("input", (e) => {
	const query = e.target.value;

	// Normal (every keystroke)
	normalCount++;
	document.getElementById("normalOutput").textContent =
		`${normalCount} calls (last: "${query}")`;

	// Debounced
	debouncedSearch(query);
});

// Example 5: Middleware
function createMiddlewarePipeline(...middlewares) {
	return (ctx) => {
		let index = 0;
		const next = () => {
			if (index >= middlewares.length) return;
			const middleware = middlewares[index++];
			middleware(ctx, next);
		};
		next();
		return ctx;
	};
}

function runMiddleware() {
	const url = document.getElementById("requestUrl").value;
	const token = document.getElementById("authToken").value;
	const output = document.getElementById("middlewareOutput");

	const ctx = { url, token, logs: [], user: null };

	const logger = (ctx, next) => {
		ctx.logs.push(
			`[${new Date().toLocaleTimeString()}] 📝 Logging: ${ctx.url}`,
		);
		next();
	};

	const auth = (ctx, next) => {
		if (!ctx.token) {
			ctx.logs.push("❌ Auth: No token provided!");
			ctx.error = "Unauthorized";
			return; // Stop chain
		}
		ctx.logs.push("✅ Auth: Token validated");
		ctx.user = { id: 1, name: "Admin" };
		next();
	};

	const dataValidator = (ctx, next) => {
		if (ctx.error) return;
		ctx.logs.push("🔍 Validator: Checking request data...");
		ctx.data = { valid: true };
		next();
	};

	const handler = (ctx, next) => {
		if (ctx.error) return;
		ctx.logs.push("🎯 Handler: Processing request");
		ctx.response = { status: 200, data: "Success" };
	};

	const pipeline = createMiddlewarePipeline(
		logger,
		auth,
		dataValidator,
		handler,
	);
	pipeline(ctx);

	output.innerHTML = `🔄 Middleware Chain Execution:
${ctx.logs.join("\n")}

${ctx.error ? `❌ Failed: ${ctx.error}` : `✅ Success: ${JSON.stringify(ctx.response)}`}
👤 User: ${ctx.user ? JSON.stringify(ctx.user) : "Not authenticated"}`;
}
