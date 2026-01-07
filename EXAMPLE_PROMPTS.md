# Example API Interactions

This document shows example conversations and prompts used by the BYO Key feature.

---

## 🎨 Tiefe öffnen (online) - Artwork Explanations

### Depth Level: Short (kurz)
**System Prompt:**
```
Du bist ein hilfreicher Assistent in einem Museum. 
Deine Antworten sind klar, ruhig und respektvoll.
```

**User Prompt:**
```
Erkläre diesen Text in 2-3 Sätzen auf Deutsch.

Text: [OCR text from artwork]
```

**Example Response:**
```
Dieses Gemälde zeigt eine Landschaft aus dem 19. Jahrhundert. 
Der Künstler verwendet warme Farbtöne, um eine friedliche Stimmung zu erzeugen. 
Es ist typisch für die romantische Epoche dieser Zeit.
```

---

### Depth Level: Medium (mittel)
**System Prompt:**
```
Du bist ein hilfreicher Assistent in einem Museum. 
Deine Antworten sind klar, ruhig und respektvoll.
```

**User Prompt:**
```
Erkläre diesen Text verständlich auf Deutsch. 
Bleibe konkret und klar.

Text: [OCR text from artwork]
```

**Example Response:**
```
Dieses Werk stammt aus der Zeit der deutschen Romantik (ca. 1820-1850). 
Der Künstler hat die Natur als Spiegel innerer Gefühle dargestellt. 

Die Verwendung von Licht und Schatten ist besonders bemerkenswert - 
sie lenkt den Blick auf die zentrale Szene und erzeugt eine meditative Atmosphäre.

Der Text auf dem Schild erklärt, dass dieses Gemälde Teil einer größeren 
Serie über die vier Jahreszeiten war. Es zeigt den Herbst als Zeit des Übergangs.
```

---

### Depth Level: Deep (tief)
**System Prompt:**
```
Du bist ein hilfreicher Assistent in einem Museum. 
Deine Antworten sind klar, ruhig und respektvoll.
```

**User Prompt:**
```
Erkläre diesen Text ausführlich auf Deutsch. 
Gib Kontext, Hintergrund und tiefere Bedeutung.

Text: [OCR text from artwork]
```

**Example Response:**
```
Dieses bedeutende Werk aus dem Jahr 1835 ist ein Schlüsselbeispiel 
der deutschen romantischen Malerei. Der Künstler, Caspar David Friedrich, 
war bekannt für seine symbolische Naturdarstellung.

Historischer Kontext:
Die Romantik entstand als Gegenbewegung zur Aufklärung und Industrialisierung. 
Künstler suchten nach dem Transzendenten in der Natur - nach etwas Größerem 
als dem rationalen Denken.

Bildkomposition:
Die Rückenfigur im Vordergrund ist typisch für Friedrich. Sie lädt den Betrachter 
ein, selbst in die Szene einzutreten und die Weite der Landschaft zu erleben. 
Der Nebel symbolisiert das Unbekannte, das Göttliche.

Farbsymbolik:
Die gedämpften Grau- und Brauntöne verstärken die melancholische Stimmung. 
Das sanfte Licht am Horizont deutet auf Hoffnung und Transzendenz hin.

Philosophische Bedeutung:
Das Werk reflektiert die romantische Vorstellung von "Sehnsucht" - 
das Verlangen nach etwas Unerreichbarem. Es ist eine Meditation über 
Einsamkeit, Vergänglichkeit und die Verbindung zwischen Mensch und Natur.
```

---

## 💬 Drüber quatschen (online) - Q&A Conversations

### Example 1: Technical Question
**System Prompt:**
```
Du bist ein hilfreicher Assistent in einem Museum. 
Beantworte Fragen zum Kunstwerk ruhig und verständlich.
```

**Context:**
```
Bezugstext: Caspar David Friedrich, "Wanderer über dem Nebelmeer", 1818. 
Öl auf Leinwand, 94,8 × 74,8 cm. Hamburger Kunsthalle.

Frage: Welche Maltechnik hat der Künstler verwendet?
```

**AI Response:**
```
Friedrich verwendete die klassische Öl-auf-Leinwand-Technik. 
Er arbeitete in mehreren Schichten (Lasuren), um die feinen Übergänge 
zwischen Licht und Schatten zu erzeugen.

Besonders interessant ist seine "Sfumato"-Technik für den Nebel - 
sehr feine, fast unsichtbare Pinselstriche, die ineinander übergehen. 
Das erzeugt die weiche, mystische Atmosphäre.

Die Rückenfigur im Vordergrund ist dagegen mit kräftigeren, 
definierten Strichen gemalt, um den Kontrast zur nebligen 
Landschaft zu verstärken.
```

---

### Example 2: Personal Reflection
**Context:**
```
Bezugstext: [Modernes abstraktes Kunstwerk]

Frage: Warum sieht das so chaotisch aus?
```

**AI Response:**
```
Das wirkt vielleicht chaotisch, hat aber oft eine bewusste Struktur. 
Abstrakte Kunst möchte keine reale Szene zeigen, sondern Gefühle, 
Energie oder Ideen ausdrücken.

Die scheinbare Unordnung kann verschiedene Dinge bedeuten:
- Die Komplexität unserer modernen Welt
- Innere emotionale Zustände
- Den Bruch mit traditionellen Regeln

Versuche nicht, etwas Konkretes zu "erkennen". 
Frage dich stattdessen: Was fühle ich, wenn ich das ansehe? 
Welche Farben ziehen mich an? Wo ruht mein Blick?

Oft sagt das mehr über das Werk aus als jede technische Analyse.
```

---

### Example 3: Historical Context
**Context:**
```
Bezugstext: [Mittelalterliches Altarbild]

Frage: Warum sind die Personen so steif gemalt?
```

**AI Response:**
```
Das ist eine typische Eigenschaft mittelalterlicher Kunst (ca. 500-1500 n.Chr.). 
Die Künstler malten nicht "realistisch" im heutigen Sinne, weil das nicht ihr Ziel war.

Religiöse Kunst sollte:
- Das Heilige und Göttliche zeigen (nicht das Alltägliche)
- Unveränderlich und ewig wirken (nicht natürlich und vergänglich)
- Symbolische Bedeutungen vermitteln (nicht optische Genauigkeit)

Die "steife" Haltung nennt man "hierarchische Proportion" - 
wichtige Personen (wie Jesus oder Heilige) wurden größer und frontaler 
dargestellt als andere.

Erst in der Renaissance (ab ca. 1400) begann man, Menschen natürlicher 
und dreidimensional zu malen. Das mittelalterliche Bild folgt einer 
anderen, älteren künstlerischen Sprache.
```

---

## 🔍 OCR Improvement (Existing Feature)

The app already has a "Besser erkennen" feature for low-confidence OCR results. 
While the current implementation is a mock, here's how it could be enhanced with AI:

### Potential Prompt
```
Korrigiere und verbessere diesen OCR-Text. 
Der Text stammt von einem Museumsschild.

Erkannter Text (mit Fehlern):
[OCR output]

Gib nur den korrigierten Text zurück, ohne Erklärung.
```

---

## ⚙️ Internal API Configuration

### Current Settings
```typescript
const CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  timeout: 30000, // 30 seconds
};
```

### Model Recommendations

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| Tiefe (kurz) | gpt-4o-mini | Fast, cheap, sufficient for short answers |
| Tiefe (mittel) | gpt-4o-mini | Good balance of quality and cost |
| Tiefe (tief) | gpt-4o or gpt-4-turbo | Better for complex, nuanced explanations |
| Drüber quatschen | gpt-4o-mini | Interactive, responsive |
| Test API Key | gpt-4o-mini | Minimal cost for validation |

### Token Estimates

| Task | Typical Tokens | Cost (gpt-4o-mini) |
|------|----------------|---------------------|
| Test Key | ~50 tokens | $0.000075 |
| Short Explanation | ~200 tokens | $0.0003 |
| Medium Explanation | ~500 tokens | $0.00075 |
| Deep Explanation | ~1000 tokens | $0.0015 |
| Q&A Response | ~300 tokens | $0.00045 |

*Based on gpt-4o-mini pricing: $0.150/1M input, $0.600/1M output tokens*

---

## 🌐 Alternative API Endpoints

The client supports any OpenAI-compatible endpoint. To use alternatives:

### Azure OpenAI
```typescript
const CONFIG = {
  baseUrl: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment',
  model: 'gpt-4',
  timeout: 30000,
};
```

### Local Models (Ollama, LM Studio, etc.)
```typescript
const CONFIG = {
  baseUrl: 'http://localhost:11434/v1',
  model: 'llama2',
  timeout: 60000, // Longer timeout for local inference
};
```

### Other Providers
Any service with OpenAI-compatible API:
- Anthropic Claude (via wrapper)
- Google Gemini (via wrapper)
- OpenRouter
- Together AI
- Replicate

---

## 🎭 Prompt Engineering Tips

### For Museum Context

**Good:**
- Clear, calm, respectful tone
- German language
- Concrete explanations
- No condescending language
- Acknowledge uncertainty

**Avoid:**
- Technical jargon without explanation
- Overly academic language
- Assumptions about viewer's knowledge
- Judgmental statements
- Marketing language

### System Prompt Variations

**For Contemporary Art:**
```
Du bist ein hilfreicher Assistent in einem Museum für zeitgenössische Kunst. 
Deine Antworten sind offen, neugierig und respektieren verschiedene Interpretationen.
```

**For Classical Art:**
```
Du bist ein Kunsthistoriker in einem Museum. 
Deine Antworten sind fundiert, aber zugänglich für alle Besucher.
```

**For Children's Museum:**
```
Du bist ein freundlicher Museums-Guide für junge Besucher. 
Erkläre Kunst einfach und spannend, ohne langweilig zu werden.
```

---

## 📊 Conversation Examples

### Example Session: Modern Art

**OCR Text:**
```
Pablo Picasso, "Les Demoiselles d'Avignon", 1907
Öl auf Leinwand, Museum of Modern Art, New York
```

**User chooses: Tiefe öffnen (online) - Medium**

**AI Response:**
```
Dies ist eines der revolutionärsten Gemälde der Kunstgeschichte. 
Picasso brach hier mit allen Regeln der traditionellen Malerei.

Die fünf Figuren sind nicht naturalistisch gemalt, sondern in geometrische 
Formen zerlegt. Das war der Beginn des Kubismus. Picasso zeigt verschiedene 
Ansichten gleichzeitig - Vorderseite und Seitenansicht im selben Gesicht.

Die Masken-ähnlichen Gesichter wurden von afrikanischer Kunst inspiriert. 
Das war damals sehr kontrovers, aber eröffnete neue Wege, wie man Kunst 
verstehen konnte - nicht als Nachahmung der Natur, sondern als eigene Realität.
```

**User asks: "Warum haben die Gesichter verschiedene Farben?"**

**AI Response:**
```
Die unterschiedlichen Farben zeigen verschiedene Perspektiven und Lichtquellen 
gleichzeitig. Das ist Teil von Picassos Experiment, Dreidimensionalität auf 
einer flachen Leinwand neu darzustellen.

Traditionell würde ein Gesicht eine einheitliche Beleuchtung haben. 
Picasso sagt: "Ich male nicht, was ich sehe, sondern was ich weiß." 
Die verschiedenen Farbtöne repräsentieren sein Wissen über die Figur 
aus verschiedenen Blickwinkeln.

Es ist, als würde man um eine Skulptur herumgehen und alle Ansichten 
auf einmal sehen - aber auf einer flachen Bildfläche.
```

---

## 🎨 Customization Guide

To adjust the AI's personality or focus:

1. **Edit System Prompts** in `OpenAIClient.ts`:
   ```typescript
   {
     role: 'system',
     content: 'Your custom system prompt here',
   }
   ```

2. **Adjust Temperature** for more creative vs. factual responses:
   ```typescript
   temperature: 0.7  // Current default
   // 0.3 = More factual, consistent
   // 1.0 = More creative, varied
   ```

3. **Change Max Tokens** for longer/shorter responses:
   ```typescript
   max_tokens: 500  // Current default
   // 200 = Very concise
   // 1000 = Detailed
   ```

---

*Example API Interactions - BYO Key Feature*  
*For testing and customization reference*
