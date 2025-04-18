# IG NRW Login-Anwendung

Eine moderne Authentifizierungs- und Benutzerverwaltungsschnittstelle, entwickelt mit React und Material-UI.

## Funktionen

- Benutzeranmeldung mit Validierung und Fehlerbehandlung
- Benutzerregistrierung mit Formularvalidierung
- Dashboard mit Organisationsauswahl
- Responsives Design mit Glasmorphismus-UI-Elementen
- Klare und wartbare Codestruktur

## Technologien

- React.js
- Material-UI für Komponenten
- React Router für die Navigation
- Axios für API-Anfragen
- Context API für die Zustandsverwaltung

## Projektstruktur

```
src/
├── components/       # UI-Komponenten nach Funktionen organisiert
│   ├── Dashboard/    # Dashboard-bezogene Komponenten
│   ├── Login/        # Login-bezogene Komponenten
│   ├── Register/     # Registrierungs-bezogene Komponenten
│   └── shared/       # Gemeinsame/wiederverwendbare Komponenten
├── context/          # React-Kontext für globale Zustandsverwaltung
├── styles/           # Gestaltete Komponenten und Theme-Definitionen
└── utils/            # Hilfsfunktionen und -tools
```

## Erste Schritte

### Voraussetzungen

- Node.js >= 14.x
- npm >= 6.x

### Installation

1. Repository klonen:
   ```
   git clone https://github.com/yourusername/login-react.git
   cd login-react
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. Entwicklungsserver starten:
   ```
   npm start
   ```

4. Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser, um die Anwendung anzuzeigen.

## Entwicklung

### Verfügbare Skripte

- `npm start` - Startet die App im Entwicklungsmodus
- `npm test` - Startet den Testrunner
- `npm run build` - Erstellt die App für die Produktion
- `npm run eject` - Löst die Anwendung aus Create-React-App heraus

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.