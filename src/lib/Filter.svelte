<script lang="ts">
    import { galleryFilter } from "../common/galleryFilter";

    function toggleDropdown(e, i){
        expanded[i] = !expanded[i];
        if(expanded[i]){
            document.addEventListener("click", myFunction, true);
        }
    }
    function myFunction(){
        for(let i = 0; i < expanded.length; i++){
            expanded[i] = false;
        }
        document.removeEventListener("click", myFunction, true);
    }
    
    let expanded:Array<Boolean> = [];

    function selectFilter(i: number, value: string): any {
        console.log(galleryFilter[i].title, value);
    }
</script>

<div class="flex gap-3">
    {#each galleryFilter as filter, i}
        <div>
            <div class="flex justify-center">
                <div>
                  <div class="dropdown relative">
                    <button
                    class="text-md font-semibold bg-slate-400/10 rounded-md py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5"
                      
                      type="button"
                      id="dropdownMenuButton2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      on:click={(e)=>toggleDropdown(e, i)}
                    >
                      {filter.title}
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="caret-down"
                        class="w-2 ml-2"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path
                          fill="currentColor"
                          d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                        ></path>
                      </svg>
                    </button>
                    <ul
                      style={`display: ${expanded[i]?'block':'none'};`}
                      class="block dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-fuchsia-900"
                      aria-labelledby="dropdownMenuButton2"
                    >
                    {#each filter.values as value}
                        <li>
                            <button 
                            on:click={()=>selectFilter(i, value)}
                            class="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 hover:bg-fuchsia-700 hover:text-white focus:text-white focus:bg-red-800 active:bg-blue-600"

                            >{value}</button>
                        </li>
                    {/each}
                    </ul>
                  </div>
                </div>
              </div>
        </div>
    {/each}
</div>
