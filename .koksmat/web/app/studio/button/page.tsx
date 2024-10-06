"use client"
import { database } from '@/actions/database/works/activityModel';
import { useSQLSelect3 } from '@/app/koksmat/usesqlselect3';
import { CommandSelectorItem } from '@/components/command-selector'
import { Result } from '@/components/database-databases';
import ItemsViewer from '@/components/items-viewer'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';
import React, { useEffect, useState } from 'react'
import { useDatabaseMixMagicbuttonItemCreate, useDatabaseMixMagicbuttonItemDelete, useDatabaseMixMagicbuttonItemRead, useDatabaseMixMagicbuttonItemUpdate } from '../../../components/hooks/useDatabaseMixMagicbutton';
import MagicButtonCreator from '@/components/magic-button-creator';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';



interface Item {
  id: number;
  name: string;
  description: string;
  updated_at: string;
  updated_by: string;
}


export default function Page() {

  const [queries, setqueries] = useState<CommandSelectorItem[]>([]);
  const c = useDatabaseMixMagicbuttonItemCreate();
  const r = useDatabaseMixMagicbuttonItemRead("1");
  const u = useDatabaseMixMagicbuttonItemUpdate();
  const d = useDatabaseMixMagicbuttonItemDelete();
  const [isOpen, setIsOpen] = useState(false)
  const query = useSQLSelect3<Item>("mix", "select id,name,description,updated_at,updated_by from magicbutton order by updated_at desc");
  useEffect(() => {


    if (query && query.dataset && query.dataset.length > 0) {
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset.map((item: any) => {
        const cmd: CommandSelectorItem = {
          id: item.id,
          title: item.name,
          description: item.name + " last edited by " + item.updated_by + " at " + item.updated_at,
          timestamp: new Date(item.updated_at),
          author: item.updated_by,
          children: <HoverCard>
            <HoverCardTrigger>Hover</HoverCardTrigger>
            <HoverCardContent>

              {item.sql}
            </HoverCardContent>
          </HoverCard>
          ,
          slug: item.name,
        };
        return cmd;
      }).sort((a: any, b: any) => a.title.localeCompare(b.title));


      setqueries(items);
    }
  }, [query.dataset]);
  return (
    <div>




      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger >
          <Button variant="outline">Create Magic Button</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Your Magic Button</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <MagicButtonCreator />
          </div>
        </DialogContent>
      </Dialog>


      <ItemsViewer allowSwitch visualisation={'table'} onSelect={function (command: CommandSelectorItem): void {
        throw new Error('Function not implemented.')
      }} placeholder={''} commands={queries} value={''} />


    </div>
  )
}
