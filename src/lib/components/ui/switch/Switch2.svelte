<script>
    export let checked = false;
    export let color = "#1353EC";
  </script>
  
  <style>
    .switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
    }
  
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 34px;
    }
  
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }
  
    input:checked + .slider {
      background-color: #1353EC;
    }
  
    input:checked + .slider {
      box-shadow: 0 0 1px #1353EC;
    }
  
    input:checked + .slider:before {
      -webkit-transform: translateX(16px);
      -ms-transform: translateX(16px);
      transform: translateX(16px);
    }
  </style>
  
  <label class="switch">
    <input type="checkbox" bind:checked on:change />
    <span class="slider" />
  </label>
  