'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MixedRecipe } from '@/types';
import { formatDate } from '@/lib/format';
import { IconBlender } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<MixedRecipe>[] = [
  {
    id: 'mode',
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ cell }) => (
      <Badge>
        <IconBlender />
        {cell.getValue<MixedRecipe['mode']>()}
      </Badge>
    ),
    enableColumnFilter: true
  },
  {
    id: 'name',
    accessorKey: 'recipes.name',
    header: 'Recipe Name',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.recipes.name}</div>
    ),
    enableColumnFilter: true
  },
  {
    id: 'total_volume',
    accessorKey: 'total_volume',
    header: 'Volume',
    cell: ({ cell }) => (
      <div>{cell.getValue<MixedRecipe['total_volume']>()} ml</div>
    )
  },
  {
    id: 'estimation_time',
    accessorKey: 'estimation_time',
    header: 'Estimation',
    cell: ({ cell }) => (
      <div>{cell.getValue<MixedRecipe['estimation_time']>()} .sec</div>
    )
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ cell }) => {
      const formattedDate = formatDate(
        cell.getValue<MixedRecipe['created_at']>(),
        {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        }
      );

      return <span>{formattedDate}</span>;
    }
  }
];
