import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SortableListProps<T> {
	items: ReadonlyArray<T>;
	getId: (item: T) => string;
	onReorder: (next: T[]) => void;
	children: (item: T, idx: number) => ReactNode;
	className?: string;
}

interface SortableRowProps {
	id: string;
	children: ReactNode;
}

const SortableRow = ({ id, children }: SortableRowProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
		boxShadow: isDragging ? '0 12px 32px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,71,46,0.4)' : undefined,
	};

	return (
		<div ref={setNodeRef} style={style} className='relative'>
			<button
				type='button'
				{...attributes}
				{...listeners}
				aria-label='Reorder'
				className={cn(
					'absolute -left-7 top-1/2 -translate-y-1/2 inline-grid place-items-center h-7 w-7',
					'cursor-grab active:cursor-grabbing text-ink-tertiary hover:text-ink-secondary',
					'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity',
				)}
			>
				<GripVertical size={14} strokeWidth={2} />
			</button>
			{children}
		</div>
	);
};

export function SortableList<T>({
	items,
	getId,
	onReorder,
	children,
	className,
}: SortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = items.findIndex((it) => getId(it) === active.id);
		const newIndex = items.findIndex((it) => getId(it) === over.id);
		if (oldIndex < 0 || newIndex < 0) return;
		onReorder(arrayMove([...items], oldIndex, newIndex));
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={items.map((it) => getId(it))} strategy={verticalListSortingStrategy}>
				<div className={cn('space-y-2', className)}>
					{items.map((item, idx) => (
						<div key={getId(item)} className='group relative'>
							<SortableRow id={getId(item)}>{children(item, idx)}</SortableRow>
						</div>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
