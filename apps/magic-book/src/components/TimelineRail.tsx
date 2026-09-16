import type {TimelineEntry} from '../book/types';

interface TimelineRailProps {
    entries: TimelineEntry[];
}

export function TimelineRail({entries}: TimelineRailProps) {
    return (
        <ol className="timeline" aria-label="Volume timeline">
            {entries.map(entry => (
                <li key={entry.id} className="timeline__entry">
                    <span className="timeline__marker" aria-hidden="true">{entry.label}</span>
                    <div>
                        <h4>{entry.title}</h4>
                        <p>{entry.body}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
