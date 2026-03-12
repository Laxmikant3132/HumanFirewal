# Human Firewall

**Human Firewall** is an advanced cybersecurity ecosystem designed to protect organizations from phishing attacks and social engineering threats. It combines real-time email analysis, URL scanning, and employee security training into a unified platform powered by a hybrid detection engine.

## 🚀 Key Features

- **AI Email Analyzer**: Hybrid analysis combining a Deep Neural Network (TF-IDF + Logistic Regression) with heuristic rules to detect phishing markers in email headers and content.
- **URL Phishing Scanner**: Real-time domain reputation check, brand spoofing detection, and typosquatting analysis for suspicious links.
- **Browser Extension (URL Analyser)**: A Manifest V3 Chrome extension that provides real-time protection by intercepting malicious URLs with a warning prompt before they load.
- **Gmail Inbox Scanner**: Seamlessly integrates with Google Workspace to continuously monitor incoming communication for potential threats.
- **UPI Fraud Detection**: Real-time analysis of UPI IDs and payment URLs to detect suspicious handles, keywords, and spoofing attempts.
- **Multilingual Interface**: Support for multiple languages including English, Hindi, and Kannada to ensure wider accessibility.
- **Admin Security Panel**: Monitor organization-wide security posture, track employee risk levels, and review detected threat logs in real-time.
- **Phishing Training Simulator**: Interactive security awareness training where employees can test their ability to identify and report simulated phishing attempts.
- **Detailed Analytics & Reports**: Exportable security reports (CSV/Excel) providing insights into weekly posture, training progress, and historical threat flows.
- **Enhanced Navigation**: Intuitive "Back" buttons on authentication pages (Login) to improve user flow and accessibility back to the landing page.

## 🧠 Detection Logic (Hybrid Engine)

The system uses a sophisticated two-tier approach for maximum accuracy:
1.  **Machine Learning Layer**: Analyzes linguistic patterns, sentiment, and structural features using a model trained on large-scale phishing datasets.
2.  **Heuristic Rule Layer**: Checks for specific technical indicators such as:
    *   Urgency/Pressure tactics
    *   Authority spoofing
    *   Credential request patterns
    *   Domain age and SSL integrity
    *   Typosquatting (e.g., `microsft.com` vs `microsoft.com`)

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Context**: React Context API
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/) & [D3.js](https://d3js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (Detection Engine)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.9+
- **ML Libraries**: Scikit-learn, Pandas, NumPy, Joblib
- **Validation**: Pydantic

### Services & Infrastructure
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
- **APIs**: [Google Gmail API](https://developers.google.com/gmail/api), [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 📦 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher
- **Firebase Project**: (Configuration already provided in `services/firebaseConfig.ts`)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/humanfirewall.git
    cd humanfirewall
    ```

2.  **Frontend Setup**
    ```bash
    npm install
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

### Running the Application

#### Option 1: One-Click Startup (Recommended)
Double-click `run_all.bat` in the root directory. This will automatically launch:
-   **Backend Server**: `https://humanfirewall-backend.onrender.com`
-   **Frontend Server**: `http://localhost:3000`

#### Option 2: Manual Startup
1.  **Start the Backend**:
    ```bash
    cd backend
    python main.py
    ```
2.  **Start the Frontend**:
    ```bash
    # In the root directory
    npm run dev
    ```

## 🔌 Browser Extension Setup

1.  Open Chrome/Edge and go to `chrome://extensions/`.
2.  Enable **Developer mode** (top-right).
3.  Click **Load unpacked** and select the `extension/` folder from the project root.
4.  The **URL Analyser** will now monitor all web traffic and warn you about suspicious domains.

## 🧪 Testing

The project uses **Playwright** for end-to-end testing.

1.  **Install Browsers** (First time only):
    ```bash
    npx playwright install
    ```

2.  **Run E2E Tests**:
    ```bash
    npx playwright test
    ```

## 📁 Project Structure

-   `app/`: Next.js 14 App Router (Pages: Dashboard, Admin, Training, Email Analyzer, URL Scanner).
-   `backend/`: FastAPI server, ML models (`models/`), and training scripts (`train_advanced.py`).
-   `extension/`: Manifest V3 browser extension source code.
-   `components/`: Reusable UI components (Hero, Features, Charts, Layouts).
-   `services/`: Firebase initialization and database service logic.
-   `lib/`: Google Auth and Gmail API integration utilities.

## 📄 License
This project is licensed under the ISC License.
