import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import Thread from './pages/Thread';

export default function App() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Switch>
                <Route path="/" component={Home} />
                <Route path="/:slug" component={Thread} />
            </Switch>
        </div>
    );
}
