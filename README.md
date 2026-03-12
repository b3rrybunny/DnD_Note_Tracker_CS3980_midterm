<h1>Midterm Project - DnD Note Tracker</h1>
<p>Bailey Ostman CS:3980:0001</p>
<h3>Description</h3>
<p>DnD Note Tracker is a demo app that allows the user to take notes on Dungeons and Dragons campaigns. Users can assign tags, campaign names, note titles, and can categorize notes. Users can allow narrow notes displayed by searching via title, tags, or category.</p>
<h3>Method</h3>
<p>Uses a React and Bootstrap frontend with FastAPI backend. Notes are created and displayed on frontend, stored via memory on the FastAPI backend.</p>
<h3>Setup</h3>
<ol>
  <li>Start a python virtual environment <code>python -m venv venv</code></li>
  <li>In virtual environment, run <code>pip install -r requirements.txt</code></li>
  <li>Navigate to backend <code>cd backend</code></li>
  <li>Start backend <code>uvicorn main:app --reload</code></li>
  <li>Navigate to frontend <code>cd frontend</code></li>
  <li>Install dependencies <code>npm install</code></li>
  <li>Start backend <code>npm run dev</code></li>
</ol>
<p>You can find the app at <a href="http://localhost:5173/">http://localhost:5173/</a></p>
<h3>Example screenshot:</h3>
<img width="1918" height="999" alt="image" src="https://github.com/user-attachments/assets/9738b0bb-cf46-41d9-b0d3-50a7454e7108" />
