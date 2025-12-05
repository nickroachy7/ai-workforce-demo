import { Button } from './components/Button'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🤖 AI Workforce Demo</h1>
      <p>Components built by AI agents:</p>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Button Component</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>
        
        <h3 style={{ marginTop: '1.5rem' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        
        <h3 style={{ marginTop: '1.5rem' }}>States</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  )
}

export default App