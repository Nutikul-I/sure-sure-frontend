<script lang="ts">
	import Swal from 'sweetalert2';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import Switch from '$lib/components/ui/switch/Switch2.svelte';
	import type { PackageData } from './+page.server.js';

	export let data;
	export let form;

	let listPackages: PackageData[] = data.packages || [];
	let search = '';

	let id = '';
	let package_name = '';
	let package_price = '';
	let quota_limit = '';
	let amount = '';
	let duration = '';
	let is_active = 1; // ใช้ number: 1 = active, 0 = inactive
	let isSubmitting = false;
	
	// Helper variable สำหรับ Switch component
	let isActiveSwitch = true;
	
	// Reactive statement เพื่อ sync is_active กับ isActiveSwitch
	$: is_active = isActiveSwitch ? 1 : 0;

	// Reactive statement เพื่อ update listPackages เมื่อ data เปลี่ยน
	$: listPackages = data.packages?.filter((e: PackageData) => 
		!search || `${e.id} ${e.package_name}`.includes(search)
	) || [];

	onMount(async () => {
		// Initial load handled by reactive statement above
	});

	function filterPackages() {
		// Trigger reactive update by reassigning search value
		search = search;
	}

	function clearSearch() {
		search = '';
	}

	function openModal(item?: PackageData) {
		if (item) {
			id = item.id.toString();
			package_name = item.package_name;
			package_price = item.package_price.toString();
			quota_limit = item.quota_limit.toString();
			amount = item.amount.toString();
			duration = item.duration.toString();
			is_active = item.is_active;
			isActiveSwitch = item.is_active === 1;
		} else {
			id = '';
			package_name = '';
			package_price = '';
			quota_limit = '';
			amount = '';
			duration = '';
			is_active = 1;
			isActiveSwitch = true;
		}
		
		const modal = document.getElementById('create-update') as HTMLDialogElement;
		modal?.showModal();
	}

	function closeModal() {
		const modal = document.getElementById('create-update') as HTMLDialogElement;
		modal?.close();
	}
</script>

<div class="p-3">
	<h4 class="h4 fw-bold">จัดการแพ็กเก็จ</h4>
	<div class="d-flex justify-content-between mb-3">
		<div class="d-flex">
			<input
				type="text"
				placeholder="รหัสแพ็กเก็จ, ชื่อแพ็กเก็จ"
				class="form-control w-72 me-2"
				bind:value={search}
			/>
			<button class="btn btn-primary bg-primary me-2" on:click={filterPackages}>ค้นหา</button>
			<button
				class="btn btn-outline"
				on:click={clearSearch}>ล้าง</button
			>
		</div>
		<button
			class="btn btn-primary bg-primary me-2"
			on:click={() => openModal()}>สร้างแพ็กเก็จ</button
		>
	</div>
	<div class="table-responsive">
		<table class="table table-hover">
			<thead>
				<tr class="bg-secondary-subtle">
					<th class="text-center">ลำดับ</th>
					<th>รหัสแพ็กเก็จ</th>
					<th>ชื่อแพ็กเก็จ</th>
					<th class="text-end">ราคา</th>
					<th class="text-end">จำนวนการใช้สูงสุด</th>
					<th class="text-end">คงเหลือ (ที่ขายได้)</th>
					<th class="text-center">เวลาแพ็กเก็จ</th>
					<th class="text-center">สถานะ</th>
					<th></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if listPackages.length === 0}
					<tr><td colspan="9">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each listPackages as item, index}
						<tr class="text-start">
							<td class="text-center">{index + 1}</td>
							<td>{item.id.toString().padStart(5, '0')}</td>
							<td title={item.package_name}>{item.package_name}</td>
							<td class="text-end">{item.package_price.toFixed(2)}</td>
							<td class="text-end">{item.quota_limit.toLocaleString()}</td>
							<td class="text-end"
								>{item.amount === 0 ? 'Unlimited' : item.amount.toLocaleString()}</td
							>
							<td class="text-center">{item.duration}</td>
							<td class="text-center"
								><small
									class="px-2 rounded-pill {item.is_active === 1 ? 'badge-success' : 'badge-danger'}"
									>{item.is_active === 1 ? 'ACTIVE' : 'DEACTIVE'}</small
								></td
							>
							<td class="p-1 sm:p-2">
								<svg
									on:click={() => openModal(item)}
									class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
									/>
								</svg>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<!-- <div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

				<div class="flex items-center space-x-2">
					<select
						class="select-sm w-full max-w-xs h-1 rounded-md bg-white"
						bind:value={limit}
						on:change={firstPage}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
						<option value={20}>20</option>
						<option value={25}>25</option>
						<option value={30}>30</option>
					</select>

					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={prevPage}
						disabled={currentPage === 1}
					>
						ย้อนกลับ
					</button>
					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={nextPage}
						disabled={currentPage === totalPages}
					>
						ต่อไป
					</button>
				</div>
			</div>
		</div> -->
	</div>
</div>

<dialog id="create-update" class="modal px-0">
	<div class="modal-box bg-white w-11/12 max-w-md p-3">
		<form 
			method="POST" 
			action="?/createUpdate"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						// ปิด modal ก่อน
						closeModal();
						
						// Refresh ข้อมูลโดยการ invalidate load function
						await invalidateAll();
						
						// แสดง success message
						Swal.fire({
							width: '26em',
							imageUrl: 'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
							imageWidth: 72,
							imageHeight: 72,
							imageAlt: 'Custom image',
							showCloseButton: true,
							title: 'สำเร็จ',
							text: (typeof result.data?.message === 'string' ? result.data.message : 'บันทึกข้อมูลสำเร็จ'),
							confirmButtonText: 'ตกลง',
							customClass: {
								container: 'mb-0 pt-2 text-md',
								image: 'mb-2',
								title: 'text-xl pt-1',
								htmlContainer: 'text-md pt-2',
								actions: 'w-100 px-3 mt-2',
								confirmButton: 'btn btn-primary bg-primary text-white w-100'
							}
						});
					} else if (result.type === 'failure') {
						// แสดง error message (ไม่ปิด modal เพื่อให้แก้ไขข้อมูล)
						Swal.fire({
							width: '26em',
							imageUrl: 'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
							imageWidth: 72,
							imageHeight: 72,
							imageAlt: 'Custom image',
							showCloseButton: true,
							title: 'เกิดข้อผิดพลาด',
							text: (typeof result.data?.message === 'string' ? result.data.message : 'กรุณาลองใหม่อีกครั้ง'),
							confirmButtonText: 'ตกลง',
							customClass: {
								container: 'mb-0 pt-2 text-md',
								image: 'mb-2',
								title: 'text-xl pt-1',
								htmlContainer: 'text-md pt-2',
								actions: 'w-100 px-3 mt-2',
								confirmButton: 'btn btn-primary bg-primary text-white w-100'
							}
						});
					}
				};
			}}
		>
			<h4 class="h4 fw-bold text-primary">{id ? 'แก้ไข' : 'เพิ่ม'}แพ็กเก็จ</h4>
			
			<input type="hidden" name="id" bind:value={id} />
			
			<label class="label">
				<span class="label-text text-black w-2/5">ชื่อแพ็กเก็จ:</span>
				<input
					type="text"
					name="package_name"
					class="form-control"
					bind:value={package_name}
					maxlength="250"
					required
				/>
			</label>

			<label class="label">
				<span class="label-text text-black w-2/5">ราคา:</span>
				<input
					type="number"
					name="package_price"
					class="form-control"
					bind:value={package_price}
					min="0"
					step="0.01"
					required
				/>
			</label>
			
			<label class="label">
				<span class="label-text text-black w-2/5">โค้วต้าสูงสุด:</span>
				<input
					type="number"
					name="quota_limit"
					class="form-control"
					bind:value={quota_limit}
					min="0"
					required
				/>
			</label>
			
			<label class="label cursor-pointer bg-white flex">
				<span class="label-text text-black w-2/5">สถานะ</span>
				<div class="w-80">
					<input 
						type="hidden" 
						name="is_active" 
						value={is_active === 1 ? 'true' : 'false'} 
					/>
					<Switch
						bind:checked={isActiveSwitch}
					/>
				</div>
			</label>
			
			<label class="label">
				<span class="label-text text-black w-2/5">จำนวนการขาย:</span>
				<input
					type="number"
					name="amount"
					class="form-control"
					bind:value={amount}
					min="0"
					required
				/>
			</label>
			
			<label class="label">
				<span class="label-text text-black w-2/5">จำนวนวันใช้งาน:</span>
				<input
					type="number"
					name="duration"
					class="form-control"
					bind:value={duration}
					min="1"
					required
				/>
			</label>

			<div class="modal-action">
				<button 
					type="button" 
					class="btn border border-gray-500 text-black"
					on:click={closeModal}
				>
					ปิด
				</button>
				<button
					type="submit"
					class="btn bg-primary text-white btn-primary hover:bg-[#050680]"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
				</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	.badge-success {
		@apply border border-success;
		background-color: #dcfae6; /* Light green background */
		color: #17b26a; /* Green text color */
	}

	.badge-danger {
		@apply border border-gray-500; /* Change border to dark gray */
		background-color: #f9fafb; /* White background */
		color: #61646c; /* Dark gray text color */
	}
</style>
