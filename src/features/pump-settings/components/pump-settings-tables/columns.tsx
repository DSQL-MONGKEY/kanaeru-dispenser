'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { MixedManual } from '@/types';
import { formatDate } from '@/lib/format';
import { IconBlender } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<MixedManual>[] = [
  {
    id: 'mode',
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ cell }) => (
      <Badge>
        <IconBlender/>
        {cell.getValue<MixedManual['mode']>()}
      </Badge>
    ),
    enableColumnFilter: true
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<MixedManual, unknown> }) => (
      <DataTableColumnHeader column={column} title='Recipe Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<MixedManual['name']>()}</div>,
    enableColumnFilter: true
  },
  
  {
    accessorKey: 'total_volume',
    header: 'Volume',
    cell: ({ cell }) => (
      <div>
        {cell.getValue<MixedManual['total_volume']>()} ml
      </div>
    )
  },
  {
    id:'id',
    accessorKey: 'estimation_time',
    header: 'Estimation',
    cell: ({ cell }) => (
      <div>
        {cell.getValue<MixedManual['estimation_time']>()} .sec
      </div>
    )
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ cell }) => {
      const formattedDate = formatDate(cell.getValue<MixedManual['created_at']>(), {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });

      return (
        <span>{formattedDate}</span>
      )
    }
  },
];
