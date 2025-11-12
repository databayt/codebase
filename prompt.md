i want to copy code from shadcn C:\Users\pc\Downloads\ui-main\ui-main\apps\v4 to create atoms page at
@src\app\[lang]\(root)\atoms\ , the atoms page exactally like https://ui.shadcn.com/docs copy paste which you can find here
C:\Users\pc\Downloads\ui-main\ui-main\apps\v4\app\(app)\docs\[[...slug]] and write plan.md file to trace the cloning progress and closely
mirror of shadcn code. it is good to know i am building atoms that constract from shadcn ui compoenents i would like to display atoms the
same way shadcn ui display there components , in /atoms i expect a sidebar and introducation content same like /docs in shadcn , as homepage
link for @src\app\[lang]\(root)\atoms\[[...slug]]\page.tsx , then dirct i expect list of links under introducation link for atoms the same
way shacn has its components , so far i want the sidebar to has two links only one for introducation and it point to /atoms and second is
/atoms//accordion .. the two pages should copy from https://ui.shadcn.com/docs and https://ui.shadcn.com/docs/components/accordion resectivly

take shadcn ui as a reference C:\Users\pc\Downloads\ui-main\ui-main\apps\v4 , i want to copy the way shadcn ui handles blocks
C:\Users\pc\Downloads\ui-main\ui-main\apps\v4\app\(app)\blocks , to handle templates https://cb.databayt.org/en/templates the exact same way
in terms of registery , cli , preview and code , copy exact code, make it pixel prefect . i have already make some good progress and i am
okey with header and page header and page nav to be different from shadcn

i want to define a tech paradigm to this project "codebase". codebase is a code library inspired by shadcn/ui , and  use its
open source code. and follow shadcn/ui pattern and best practices in many cases including there contrbuiting guide as well as listen to new
updates in shadcn/ui repository .. so shadcn/ui is the main insipration and the one that codebase follow it closely, yet with  little
adjustment .. shadcn/ui and the ecosystem around it , they built great premitive components and kits and blocks and serives that i would like
to orginaze it following a perconfigured architecture  @agent-architect . in codebase we have docs and  atoms and templates against docs and
components and blocks in shadcn/ui respectivly. we  wants to borrow shadcn/ui engine to power atoms, where atoms would be using the same
logic and style form components in shadcn/ui , and templates uses the same logic and style of blocks in shadcn/ui.

