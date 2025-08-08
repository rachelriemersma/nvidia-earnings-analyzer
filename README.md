# NVIDIA Earnings Analyzer

AI-powered application that analyzes NVIDIA earnings call transcripts to extract sentiment and strategic insights.

## What the App Does

This application automatically identifies, retrieves, and analyzes NVIDIA's earnings call transcripts for the last four quarters, extracting four key types of signals:

**Signal Extraction:**
1. **Management Sentiment**: Overall sentiment (positive/neutral/negative) of prepared remarks by executives
2. **Q&A Sentiment**: Overall tone and sentiment during the Q&A portion  
3. **Quarter-over-Quarter Tone Change**: Analysis and comparison of sentiment/tone shifts across the four quarters
4. **Strategic Focuses**: 3-5 key themes or initiatives emphasized each quarter (e.g., AI growth, data center expansion)

**User Interface:**
- Display transcripts with full earnings call content and searchable sections
- Visualize sentiment scores with interactive charts showing trends over time
- Highlight major strategic focuses using theme cards with importance scores and supporting quotes
- Show tone change trends with quarter-over-quarter comparisons and significance indicators

## How to Run It Locally

**Prerequisites:**
- Node.js 18 or higher
- OpenAI API key (get one at https://platform.openai.com/api-keys)

**Installation Steps:**
```bash
# 1. Clone the repository
git clone https://github.com/your-username/nvidia-earnings-analyzer.git
cd nvidia-earnings-analyzer

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file in project root with:
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

**Using the Application:**
1. Click "Run New Analysis" to process NVIDIA earnings data
2. Navigate between quarters using the quarter selector tabs
3. View sentiment scores, strategic themes, and trend analysis
4. Explore full transcripts in the transcript viewer section

## AI/NLP Tools, APIs, and Models Used

**Primary AI System:**
- **OpenAI GPT-3.5 Turbo**: Used for all natural language processing tasks
- **Model**: gpt-3.5-turbo
- **Purpose**: Sentiment analysis, strategic theme extraction, and trend analysis

**Implementation Details:**
- **Sentiment Analysis**: Structured prompts analyze management remarks and Q&A sessions separately
- **Strategic Theme Extraction**: AI identifies 3-5 key business themes per quarter with importance scoring
- **Quarter-over-Quarter Analysis**: Automated comparison of sentiment shifts with significance detection
- **Confidence Scoring**: All AI responses include confidence levels (0-1 scale)

**Data Processing Pipeline:**
- **Web Scraping**: Axios and Cheerio for automated transcript collection from public sources
- **Text Processing**: Custom parsing to separate management remarks from Q&A sections
- **Rate Limiting**: 1-2 second delays between API calls to respect service limits
- **Error Handling**: Comprehensive fallback systems for failed requests

**APIs and Libraries:**
- OpenAI API for language model access
- Next.js API routes for backend processing
- Recharts for data visualization
- TypeScript for type safety

## Key Assumptions and Limitations

**Data Collection Assumptions:**
- Transcript data is available from public sources (Seeking Alpha, Yahoo Finance, Motley Fool)
- Standard earnings call format with distinct management remarks and Q&A sections
- Quarter identification follows standard fiscal calendar (Q1-Q4 2024)

**Current Limitations:**
- **Anti-bot measures**: Real-time web scraping is often blocked by target websites
- **Sample data usage**: Application currently uses enhanced sample data that mimics real NVIDIA transcript patterns
- **API rate limits**: OpenAI processing limited to prevent quota exhaustion
- **Analysis time**: Full 4-quarter analysis takes 60-90 seconds due to multiple AI processing steps

**Technical Limitations:**
- **In-memory storage**: Data is not persisted between application restarts
- **Single company focus**: Currently configured specifically for NVIDIA earnings analysis
- **English language only**: AI analysis optimized for English-language transcripts

**Production Considerations:**
- **Manual data entry**: Real production system would likely use manual transcript uploads or financial data API partnerships
- **Database requirement**: Persistent storage needed for production deployment
- **Scalability**: Current architecture designed for demonstration rather than high-volume processing

**AI Analysis Limitations:**
- **Confidence varies**: AI analysis accuracy depends on transcript quality and clarity
- **Context sensitivity**: Sentiment analysis may miss nuanced financial terminology or industry-specific context
- **Consistency**: Strategic theme identification may vary between analysis runs due to AI model variations

**Documentation of Manual Steps:**
When web scraping fails (expected due to anti-bot measures), the system:
1. Attempts automated collection from multiple public sources
2. Falls back to structured sample data based on real NVIDIA earnings patterns
3. Clearly indicates data source in the user interface
4. Maintains full AI analysis pipeline regardless of data source

This approach demonstrates the technical capability while acknowledging real-world constraints of automated financial data collection.
