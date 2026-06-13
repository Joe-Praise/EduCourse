import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../../ui';

interface FocusToggleButtonProps {
	focused: boolean;
	onToggle: () => void;
}

export const FocusToggleButton = ({ focused, onToggle }: FocusToggleButtonProps) => (
	<Button
		variant='ghost'
		size='sm'
		onClick={onToggle}
		iconLeading={focused ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
		title='Toggle focus mode (F)'
		aria-pressed={focused}
	>
		{focused ? 'Exit focus' : 'Focus mode'}
	</Button>
);
